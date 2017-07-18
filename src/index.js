const looksLike = require('./utils/looks-like');

const consolePlugin = babel => {
  const { template, types: t } = babel;

  const buildLog = (...args) => template('console.log(args);')({ args });
  const buildGroupCollapsed = title => template('console.groupCollapsed(title);')({ title });
  const buildGroupEnd = title => template('console.groupEnd(title);')({ title });
  const findParentFunction = path =>
    path.findParent(parent => {
      return t.isFunctionDeclaration(parent) || t.isArrowFunctionExpression(parent) || t.isFunctionExpression(parent);
    });
  function isNotRootFunction(path) {
    return (
      !looksLike(path, { node: { id: t.isIdentifier } }) &&
      !t.isVariableDeclarator(path.parent) &&
      !t.isFunctionExpression(path.parent)
    );
  }

  function mapIdentifer(x) {
    const { loc: { start: { column, line } }, name } = x;
    return buildLog(t.stringLiteral(`(${line}:${column})`), t.stringLiteral(`${name}:`), x);
  }

  return {
    name: 'console',
    visitor: {
      CallExpression(path) {
        const isConsoleScope = looksLike(path, {
          node: {
            callee: {
              type: 'MemberExpression',
              object: {
                name: 'console'
              },
              property: {
                name: 'scope'
              }
            }
          }
        });

        if (!isConsoleScope) {
          return;
        }
        const scope = traverseFunctions(path);

        if (!scope) {
          return path.remove();
        }

        const { parameterIdentifiers, parentScope, returnStatement, signature, variableIdentifiers } = scope;

        const parameters = parameterIdentifiers.map(mapIdentifer);
        const variables = variableIdentifiers.map(mapIdentifer);

        const returnNode = returnStatement
          ? buildLog(
              t.stringLiteral(`(${returnStatement.loc.start.line}:${returnStatement.loc.start.column})`),
              returnStatement
            )
          : buildLog(t.stringLiteral('Void'));

        const scriptScope = Object.keys(parentScope).map(key => {
          const { identifier } = parentScope[key];
          const { loc: { start: { column, line } }, name } = identifier;
          return buildLog(t.stringLiteral(`(${line}:${column})`), t.stringLiteral(`${name}:`), identifier);
        });

        path.replaceWithMultiple([
          buildLog(...path.node.arguments),
          buildGroupCollapsed(t.stringLiteral(signature)),
          buildGroupCollapsed(t.stringLiteral('Parameters')),
          ...parameters,
          buildGroupEnd(t.stringLiteral('Parameters')),
          buildGroupCollapsed(t.stringLiteral('Variables')),
          ...variables,
          buildGroupEnd(t.stringLiteral('Variables')),
          buildGroupCollapsed(t.stringLiteral('Return')),
          returnNode,
          buildGroupEnd(t.stringLiteral('Return')),
          buildGroupCollapsed(t.stringLiteral('Script')),
          ...scriptScope,
          buildGroupEnd(t.stringLiteral('Script')),
          buildGroupEnd(t.stringLiteral(signature))
        ]);
      }
    }
  };

  function traverseFunctions(path) {
    const parentFunction = findParentFunction(path);
    if (!parentFunction) {
      return null;
    }

    let rootFunction = findParentFunction(path); // you want to do a deep copy here

    let variableIdentifiers = [...getVariableIdentifiers(parentFunction.scope.bindings)];
    // TOOD: do not flattern params then you can check if a function has been curried
    let parameterIdentifiers = [...getParamIdentifiers(parentFunction.scope.bindings)];
    let args = [getParamIdentifiers(parentFunction.scope.bindings)];
    while (isNotRootFunction(rootFunction)) {
      const maybeParent = findParentFunction(rootFunction);
      if (!maybeParent) {
        break;
      }
      rootFunction = maybeParent;
      variableIdentifiers.unshift(...getVariableIdentifiers(rootFunction.scope.bindings));
      parameterIdentifiers.unshift(...getParamIdentifiers(rootFunction.scope.bindings));
      args.unshift(getParamIdentifiers(rootFunction.scope.bindings));
    }

    const parentScope = rootFunction.scope.parent.bindings;
    const stmt = parentFunction.node.body.body.find(rest => t.isReturnStatement(rest));
    const returnStatement = stmt && stmt.argument;

    const signature =
      args.length > 1 ? getCurriedFunctionSignature(rootFunction, args) : getFunctionSignature(rootFunction, args);

    return { parameterIdentifiers, parentScope, variableIdentifiers, returnStatement, signature };
  }

  function getVariableIdentifiers(bindings) {
    return Object.keys(bindings).filter(key => bindings[key].kind !== 'param').map(key => bindings[key].identifier);
  }

  function getParamIdentifiers(bindings) {
    return Object.keys(bindings).filter(key => bindings[key].kind === 'param').map(key => bindings[key].identifier);
  }

  function getFunctionSignature(rootFunction, parameters) {
    const params = parameters[0].map(({ name }) => name).join(', ');

    if (looksLike(rootFunction, { node: { id: t.isIdentifier } })) {
      const name = rootFunction.node.id.name;
      const { column, line } = rootFunction.node.loc.start;
      return buildFunctionDeclarationSignature(line, column, name, params);
    }

    if (t.isExportDefaultDeclaration(rootFunction.parent)) {
      const { node: declaration } = rootFunction.findParent(par => t.isExportDefaultDeclaration(par));
      const { column, line } = declaration.loc.start;
      return buildDefaultExportSignature(line, column, params);
    }

    const name = rootFunction.parent.id.name;
    const { column, line } = rootFunction.parent.loc.start;
    const kind = rootFunction.findParent(par => t.isVariableDeclaration(par)).node.kind;

    if (t.isArrowFunctionExpression(rootFunction)) {
      return buildArrowFunctionSignature(line, column, kind, name, params);
    }

    return buildFunctionExpressionSignature(line, column, kind, name, params);
  }

  function buildFunctionDeclarationSignature(line, column, name, params) {
    return `(${line}:${column}) function ${name}(${params}) {...}`;
  }

  function buildDefaultExportSignature(line, column, params) {
    return `(${line}:${column}) export default function (${params}) {...}`;
  }
  function buildFunctionExpressionSignature(line, column, kind, name, params) {
    return `(${line}:${column}) ${kind} ${name} = function(${params}) => {...}`;
  }
  function buildArrowFunctionSignature(line, column, kind, name, params) {
    return `(${line}:${column}) ${kind} ${name} = (${params}) => {...}`;
  }

  function getCurriedFunctionSignature(rootFunction, parameters) {
    if (t.isFunctionDeclaration(rootFunction)) {
      const kind = 'const';
      const { column, line } = rootFunction.node.loc.start;
      const name = rootFunction.node.id.name;
      const params = buildCurriedParameters(parameters);

      return buildCurriedSignature(line, column, kind, name, params);
    }

    if (t.isExportDefaultDeclaration(rootFunction.parent)) {
      const { node: declaration } = rootFunction.findParent(par => t.isExportDefaultDeclaration(par));
      const { column, line } = declaration.loc.start;
      const params = buildCurriedParameters(parameters);
      return buildCurriedDefaultExportSignature(line, column, params);
    }

    const { node: declaration } = rootFunction.findParent(par => t.isVariableDeclaration(par));
    const kind = declaration.kind;
    const { column, line } = declaration.loc.start;
    const name = rootFunction.parent.id.name;
    const params = buildCurriedParameters(parameters);

    return buildCurriedSignature(line, column, kind, name, params);
  }

  function buildCurriedParameters(parameters) {
    return parameters.reduce((acc, arg, index) => {
      const stringArgs = arg.map(({ name }) => name).join(', ');
      if (index === 0) return `(${stringArgs})`;
      return `${acc} => (${stringArgs})`;
    }, '');
  }

  function buildCurriedSignature(line, column, kind, name, params) {
    return `(${line}:${column}) ${kind} ${name} = ${params} => {...}`;
  }

  function buildCurriedDefaultExportSignature(line, column, params) {
    return `(${line}:${column}) export default = ${params} => {...}`;
  }
};

module.exports = consolePlugin;
