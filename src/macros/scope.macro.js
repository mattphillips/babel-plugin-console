import { createMacro } from 'babel-plugin-macros';
import generateScopeLog from '../scope';

module.exports = createMacro(({ babel: { template, types }, references }) =>
  references.default.forEach(({ parentPath }) =>
    parentPath.replaceWithMultiple(generateScopeLog(parentPath, template, types))
  )
);
