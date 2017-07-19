import generateScopeLog from '../scope';

module.exports = ({ babel: { template, types }, references }) =>
  references.default.forEach(({ parentPath }) =>
    parentPath.replaceWithMultiple(generateScopeLog(parentPath, template, types))
  );
