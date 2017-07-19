import generateScopeLogs from './scope';
import looksLike from './utils/looks-like';

module.exports = babel => {
  const { template, types } = babel;
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

        const scope = generateScopeLogs(path, template, types);

        path.replaceWithMultiple(scope);
      }
    }
  };
};
