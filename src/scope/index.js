import { flatten } from '../utils';
import looksLike from '../utils/looks-like';

import { getParamIdentifiers, getVariableIdentifiers } from './identifiers';
import getSignature from './signatures';
import templateBuilders from './templates';

export default (path, template, t) => {
  const { buildGroupCollapsed, buildGroupEnd, buildLog } = templateBuilders(template);

  const scope = traverseFunctions(path, t);

  if (!scope) {
    return;
  }

  const { parameterIdentifiers, parentScope, returnStatement, signature, variableIdentifiers } = scope;

  const mapIdentifer = identifier => {
    const { loc: { start: { column, line } }, name } = identifier;
    return buildLog(t.stringLiteral(`(${line}:${column})`), t.stringLiteral(`${name}:`), identifier);
  };
  const parameters = parameterIdentifiers.map(mapIdentifer);
  const variables = variableIdentifiers.map(mapIdentifer);
  const buildReturn = returnStatement => {
    if (returnStatement) {
      const { loc: { start: { column, line } } } = returnStatement;
      return buildLog(t.stringLiteral(`(${line}:${column})`), returnStatement);
    }
    return buildLog(t.stringLiteral('Void'));
  };
  const scriptScope = Object.keys(parentScope).map(key => {
    const { identifier } = parentScope[key];
    const { loc: { start: { column, line } }, name } = identifier;
    return buildLog(t.stringLiteral(`(${line}:${column})`), t.stringLiteral(`${name}:`), identifier);
  });

  return [
    buildLog(...path.node.arguments),
    buildGroupCollapsed(t.stringLiteral(signature)),
    buildGroupCollapsed(t.stringLiteral('Parameters')),
    ...parameters,
    buildGroupEnd(t.stringLiteral('Parameters')),
    buildGroupCollapsed(t.stringLiteral('Variables')),
    ...variables,
    buildGroupEnd(t.stringLiteral('Variables')),
    buildGroupCollapsed(t.stringLiteral('Return')),
    buildReturn(returnStatement),
    buildGroupEnd(t.stringLiteral('Return')),
    buildGroupCollapsed(t.stringLiteral('Script')),
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

  const parentScope = rootFunction.scope.parent.bindings;
  const stmt = parentFunction.node.body.body.find(rest => t.isReturnStatement(rest));
  const returnStatement = stmt && stmt.argument;

  return {
    parameterIdentifiers: flatten(parameters),
    parentScope,
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
