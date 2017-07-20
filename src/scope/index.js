import { flatten } from '../utils';
import looksLike from '../utils/looks-like';

import { getParamIdentifiers, getVariableIdentifiers } from './identifiers';
import getSignature, {
  buildArrowFunctionSignature,
  buildFunctionDeclarationSignature,
  buildFunctionExpressionSignature
} from './signatures';
import templateBuilders from './templates';

export default (path, template, t) => {
  const { buildGroupCollapsed, buildGroupEnd, buildLog } = templateBuilders(template);

  const scope = traverseFunctions(path, t);

  if (!scope) {
    return;
  }

  const { bindings, parameterIdentifiers, returnStatement, signature, variableIdentifiers } = scope;

  const mapIdentifer = identifier => {
    const { loc: { start: { column, line } }, name } = identifier;
    return buildLog(t.stringLiteral(`(${line}:${column})`), t.stringLiteral(`${name}:`), identifier)(1);
  };
  const parameters = parameterIdentifiers.map(mapIdentifer);
  const variables = variableIdentifiers.map(mapIdentifer);
  const buildReturn = returnStatement => {
    if (returnStatement) {
      const { loc: { start: { column, line } } } = returnStatement;
      return buildLog(t.stringLiteral(`(${line}:${column})`), returnStatement)(1);
    }
    return buildLog(t.stringLiteral('Void'))(1);
  };

  const joinParams = params => params.map(({ name }) => name).join(', ');

  const scriptScope = Object.keys(bindings)
    .filter(key => {
      const binding = bindings[key];
      const isRequire = looksLike(binding.path, { node: { init: { callee: { name: 'require' } } } });
      return binding.kind !== 'module' && !isRequire;
    })
    .map(key => {
      const binding = bindings[key];
      const { identifier } = binding;
      const { loc: { start: { column, line } }, name } = identifier;

      const isFunction = looksLike(binding, { path: t.isFunctionDeclaration });
      const isArrow = looksLike(binding.path, { node: { init: t.isArrowFunctionExpression } });
      const isFunctionExpression = looksLike(binding.path, { node: { init: t.isFunctionExpression } });

      if (isArrow) {
        const signature = buildArrowFunctionSignature(
          line,
          column,
          binding.kind,
          name,
          joinParams(binding.path.node.init.params)
        );
        return buildLog(t.stringLiteral(signature))(1);
      }

      if (isFunction) {
        const signature = buildFunctionDeclarationSignature(line, column, name, joinParams(binding.path.node.params));
        return buildLog(t.stringLiteral(signature))(1);
      }

      if (isFunctionExpression) {
        const signature = buildFunctionExpressionSignature(
          line,
          column,
          binding.kind,
          name,
          joinParams(binding.path.node.init.params)
        );
        return buildLog(t.stringLiteral(signature))(1);
      }

      return buildLog(t.stringLiteral(`(${line}:${column})`), t.stringLiteral(`${name}:`), identifier)(1);
    });

  return [
    buildLog(...path.node.arguments)(0),
    buildGroupCollapsed(t.stringLiteral(signature))(0),
    buildGroupCollapsed(t.stringLiteral('Parameters'))(1),
    ...parameters,
    buildGroupEnd(t.stringLiteral('Parameters')),
    buildGroupCollapsed(t.stringLiteral('Variables'))(1),
    ...variables,
    buildGroupEnd(t.stringLiteral('Variables')),
    buildGroupCollapsed(t.stringLiteral('Return'))(1),
    buildReturn(returnStatement),
    buildGroupEnd(t.stringLiteral('Return')),
    buildGroupCollapsed(t.stringLiteral('Script'))(1),
    ...scriptScope,
    buildGroupEnd(t.stringLiteral('Script')),
    buildGroupEnd(t.stringLiteral(signature))
  ];
};

const traverseFunctions = (path, t) => {
  const parentFunction = findParentFunction(path, t);

  if (!parentFunction) {
    return null;
  }

  let rootFunction = parentFunction;
  let variables = [getVariableIdentifiers(parentFunction.scope.bindings)];
  let parameters = [getParamIdentifiers(parentFunction.scope.bindings)];

  while (isNotRootFunction(rootFunction, t)) {
    const maybeParentFunction = findParentFunction(rootFunction, t);
    if (!maybeParentFunction) {
      break;
    }
    rootFunction = maybeParentFunction;
    variables.unshift(getVariableIdentifiers(rootFunction.scope.bindings));
    parameters.unshift(getParamIdentifiers(rootFunction.scope.bindings));
  }

  const { bindings } = rootFunction.scope.parent;
  const stmt = parentFunction.node.body.body.find(rest => t.isReturnStatement(rest));
  const returnStatement = stmt && stmt.argument;

  return {
    bindings,
    parameterIdentifiers: flatten(parameters),
    returnStatement,
    signature: getSignature(t, parameters, rootFunction),
    variableIdentifiers: flatten(variables)
  };
};

const findParentFunction = (path, t) =>
  path.findParent(parent => {
    return t.isFunctionDeclaration(parent) || t.isArrowFunctionExpression(parent) || t.isFunctionExpression(parent);
  });

const isNotRootFunction = (path, t) =>
  !looksLike(path, { node: { id: t.isIdentifier } }) &&
  !t.isVariableDeclarator(path.parent) &&
  !t.isFunctionExpression(path.parent);
