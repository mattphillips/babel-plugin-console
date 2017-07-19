const { negate } = require('../../utils');

const getIdentifiers = predicate => bindings =>
  Object.keys(bindings).map(key => bindings[key]).filter(predicate).map(({ identifier }) => identifier);

const isParam = binding => binding.kind === 'param';

const getParamIdentifiers = getIdentifiers(isParam);
const getVariableIdentifiers = getIdentifiers(negate(isParam));

export { getParamIdentifiers, getVariableIdentifiers };
