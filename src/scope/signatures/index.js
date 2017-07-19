const looksLike = require('../../utils/looks-like');

export default (types, parameters, rootFunction) => {
  if (parameters.length > 1) {
    return getCurriedFunctionSignature(types, parameters, rootFunction);
  }

  return getFunctionSignature(types, parameters, rootFunction);
};

const getCurriedFunctionSignature = (types, parameters, rootFunction) => {
  if (types.isFunctionDeclaration(rootFunction)) {
    const kind = 'const';
    const { column, line } = rootFunction.node.loc.start;
    const name = rootFunction.node.id.name;
    const params = buildCurriedParameters(parameters);

    return buildCurriedSignature(line, column, kind, name, params);
  }

  if (types.isExportDefaultDeclaration(rootFunction.parent)) {
    const { node: declaration } = rootFunction.findParent(par => types.isExportDefaultDeclaration(par));
    const { column, line } = declaration.loc.start;
    const params = buildCurriedParameters(parameters);

    return buildCurriedDefaultExportSignature(line, column, params);
  }

  const { node: declaration } = rootFunction.findParent(par => types.isVariableDeclaration(par));
  const kind = declaration.kind;
  const { column, line } = declaration.loc.start;
  const name = rootFunction.parent.id.name;
  const params = buildCurriedParameters(parameters);

  return buildCurriedSignature(line, column, kind, name, params);
};

const buildCurriedParameters = parameters => {
  return parameters.reduce((acc, arg, index) => {
    const stringArgs = arg.map(({ name }) => name).join(', ');
    if (index === 0) return `(${stringArgs})`;
    return `${acc} => (${stringArgs})`;
  }, '');
};

const buildCurriedSignature = (line, column, kind, name, params) =>
  `(${line}:${column}) ${kind} ${name} = ${params} => {...}`;

const buildCurriedDefaultExportSignature = (line, column, params) =>
  `(${line}:${column}) export default = ${params} => {...}`;

const getFunctionSignature = (types, parameters, rootFunction) => {
  const params = parameters[0].map(({ name }) => name).join(', ');

  if (looksLike(rootFunction, { node: { id: types.isIdentifier } })) {
    const name = rootFunction.node.id.name;
    const { column, line } = rootFunction.node.loc.start;
    return buildFunctionDeclarationSignature(line, column, name, params);
  }

  if (types.isExportDefaultDeclaration(rootFunction.parent)) {
    const { node: declaration } = rootFunction.findParent(par => types.isExportDefaultDeclaration(par));
    const { column, line } = declaration.loc.start;
    return buildDefaultExportSignature(line, column, params);
  }

  const name = rootFunction.parent.id.name;
  const { column, line } = rootFunction.parent.loc.start;
  const kind = rootFunction.findParent(par => types.isVariableDeclaration(par)).node.kind;

  if (types.isArrowFunctionExpression(rootFunction)) {
    return buildArrowFunctionSignature(line, column, kind, name, params);
  }

  return buildFunctionExpressionSignature(line, column, kind, name, params);
};

const buildFunctionDeclarationSignature = (line, column, name, params) =>
  `(${line}:${column}) function ${name}(${params}) {...}`;

const buildDefaultExportSignature = (line, column, params) =>
  `(${line}:${column}) export default function (${params}) {...}`;

const buildFunctionExpressionSignature = (line, column, kind, name, params) =>
  `(${line}:${column}) ${kind} ${name} = function(${params}) => {...}`;

const buildArrowFunctionSignature = (line, column, kind, name, params) =>
  `(${line}:${column}) ${kind} ${name} = (${params}) => {...}`;
