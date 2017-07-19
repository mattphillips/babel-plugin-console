import pluginTester from 'babel-plugin-tester';
import plugin from 'babel-macros';

pluginTester({
  plugin,
  snapshot: true,
  tests: withFilename({
    'Called outside of a function > remove console scope call': {
      snapshot: true,
      code: `
        import scope from './scope.macro'
        const c = 10;
        scope('should be removed');
      `
    },
    'Function Declaration > does not change when custom console scope is not present': {
      code: `
      import scope from './scope.macro'
      function add(a, b) {
        const c = 10;
        console.log('Custom add function message');
        return a + b + c;
      }
      `
    },
    'Function Expression > does not change when custom console scope is not present': {
      code: `
      import scope from './scope.macro'
      const add = function (a, b) {
        const c = 10;
        console.log('Custom add function message');
        return a + b + c;
      };
      `
    },
    'Array Function > does not change when custom console scope is not present': {
      code: `
      import scope from './scope.macro'
      const add = (a, b) => {
        const c = 10;
        console.log('Custom add function message');
        return a + b + c;
      };
      `
    },
    'Curried Function > does not change when custom console scope is not present': {
      code: `
      import scope from './scope.macro'
      const add = a => b => {
        const c = 10;
        console.log('Custom add function message');
        return a + b + c;
      };
      `
    },
    'Function Declaration > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      import scope from './scope.macro'
      function add(a, b) {
        const c = 10;
        scope('Custom add function message');
        return a + b + c;
      }
      `
    },
    'Function Expression > const > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      const add = function(a, b) {
        const c = 10;
        scope('Custom add function message');
        return a + b + c;
      }
      `
    },
    'Function Expression > let > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      let add = function(a, b) {
        const c = 10;
        scope('Custom add function message');
        return a + b + c;
      }
      `
    },
    'Arrow Function > const > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      const add = (a, b) => {
        const c = 10;
        scope('Custom add function message');
        return a + b + c;
      }
      `
    },
    'Arrow Function > let > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      let add = (a, b) => {
        const c = 10;
        scope('Custom add function message');
        return a + b + c;
      }
      `
    },
    'Curried Arrow Function > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      const add = (a) => (b) => {
        const c = 10;
        scope('Custom add function message');
        return a + b + c;
      }
      `
    },
    'Curried Function Declarion > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      function add(a) {
        return (b) => {
          const c = 10;
          scope('Custom add function message');
          return a + b + c;
        }
      }
      `
    },
    'Curried Function Expression > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      const add = function (a) {
        return function(b) {
          const c = 10;
          scope('Custom add function message');
          return a + b + c;
        }
      }
      `
    },
    'Curried functions > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      const add = function (a) {
        return function(b) {
          return c => {
            const d = 10;
            scope('Custom add function message');
            return a + b + c + d;
          }
        }
      }
      `
    },
    'Return statement should be void when no return found': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      const add = function (a, b) {
        scope('Custom add function message');
        a + b;
      }
      `
    },
    'Finds script scope': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      const hello = 'hello';
      function divide(a, b) {
        return a / b;
      }
      function add(a, b) {
        scope('Custom add function message');
        return a + b;
      }
      `
    },
    'Export default Function  > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      export default function(state = 0, action) {
        scope('Add one reducer');
        return state + 1;
      }
      `
    },
    'Export default Curried Function  > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      export default addOne => (state = 0, action) => {
        scope('Add one reducer');
        return addOne(state);
      }
      `
    },
    'Spread arguments': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      const sum = (...xs) => {
        scope('Sum args');
        return xs.reduce((acc, x) => acc + x, 0);
      }
      `
    },
    'Multiple scopes': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      const sum = (...xs) => {
        scope('Sum args');
        return xs.reduce((acc, x) => acc + x, 0);
      }

      const add = (a, b) => {
        scope('Adding stuff up');
        return a + b;
      }
      `
    },
    'Async functions': {
      snapshot: true,
      code: `
      import scope from './scope.macro';
      const getApi = async (url) => {
        scope('Requesting some data');
        return await fetch(url);
      }
      `
    },
    'module.exports function': {
      skip: true,
      snapshot: true,
      code: `
      import scope from './scope.macro';
      module.exports = (a, b) => {
        scope('Adding stuff up');
        return a + b;
      }
      `
    },
    'Multiple return statements': {
      snapshot: true,
      skip: true,
      code: `
      import scope from './scope.macro';
      const greater = (a, b) => {
        if(a > 1) {
          const c = 'c is for charlie';
          scope('greater than');
          return a;
        }
        const d = 'd is for delta';
        return b;
      }
      `
    },
    'Switch case return': {
      snapshot: true,
      skip: true,
      code: `
      import scope from './scope.macro';
      export default (state = 0, action) => {
        switch(action.type) {
          case 'ADD': {
            scope('Add reducer');
            return add(state, 1);
          }

          default: {
            return 0;
          }
        }
      }
      `
    }
  })
});

function withFilename(tests) {
  return Object.keys(tests).map(key => {
    const t = tests[key];
    const test = { babelOptions: { filename: __filename } };
    if (typeof t === 'string') {
      test.code = t;
    } else {
      Object.assign(test, t);
    }
    return test;
  });
}
