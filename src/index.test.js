import pluginTester from 'babel-plugin-tester';
import plugin from './';

pluginTester({
  plugin,
  tests: {
    'Function Declaration > does not change when custom console scope is not present': {
      code: `
      function add(a, b) {
        const c = 10;
        console.log('Custom add function message');
        return a + b + c;
      }
      `
    },
    'Function Expression > does not change when custom console scope is not present': {
      code: `
      const add = function (a, b) {
        const c = 10;
        console.log('Custom add function message');
        return a + b + c;
      };
      `
    },
    'Array Function > does not change when custom console scope is not present': {
      code: `
      const add = (a, b) => {
        const c = 10;
        console.log('Custom add function message');
        return a + b + c;
      };
      `
    },
    'Curried Function > does not change when custom console scope is not present': {
      code: `
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
      function add(a, b) {
        const c = 10;
        console.scope('Custom add function message');
        return a + b + c;
      }
      `
    },
    'Function Expression > const > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      const add = function(a, b) {
        const c = 10;
        console.scope('Custom add function message');
        return a + b + c;
      }
      `
    },
    'Function Expression > let > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      let add = function(a, b) {
        const c = 10;
        console.scope('Custom add function message');
        return a + b + c;
      }
      `
    },
    'Arrow Function > const > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      const add = (a, b) => {
        const c = 10;
        console.scope('Custom add function message');
        return a + b + c;
      }
      `
    },
    'Arrow Function > let > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      let add = (a, b) => {
        const c = 10;
        console.scope('Custom add function message');
        return a + b + c;
      }
      `
    },
    'Curried Arrow Function > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      const add = (a) => (b) => {
        const c = 10;
        console.scope('Custom add function message');
        return a + b + c;
      }
      `
    },
    'Curried Function Declarion > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      function add(a) {
        return (b) => {
          const c = 10;
          console.scope('Custom add function message');
          return a + b + c;
        }
      }
      `
    },
    'Curried Function Expression > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      const add = function (a) {
        return function(b) {
          const c = 10;
          console.scope('Custom add function message');
          return a + b + c;
        }
      }
      `
    },
    'Curried functions > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      const add = function (a) {
        return function(b) {
          return c => {
            const d = 10;
            console.scope('Custom add function message');
            return a + b + c + d;
          }
        }
      }
      `
    },
    'Return statement should be void when no return found': {
      snapshot: true,
      code: `
      const add = function (a, b) {
        console.scope('Custom add function message');
        a + b;
      }
      `
    },
    'Finds script scope': {
      snapshot: true,
      code: `
      const hello = 'hello';
      function divide(a, b) {
        return a / b;
      }
      function add(a, b) {
        console.scope('Custom add function message');
        return a + b;
      }
      `
    },
    'Export default Function  > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      export default function(state = 0, action) {
        console.scope('Add one reducer');
        return state + 1;
      }
      `
    },
    'Export default Curried Function  > scope of: custom message, function signature, params, variable, return value and script': {
      snapshot: true,
      code: `
      export default addOne => (state = 0, action) => {
        console.scope('Add one reducer');
        return addOne(state);
      }
      `
    },
    'Spread arguments': {
      snapshot: true,
      code: `
      const sum = (...xs) => {
        console.scope('Sum args');
        return xs.reduce((acc, x) => acc + x, 0);
      }
      `
    },
    'Multiple return statements': {
      snapshot: true,
      skip: true,
      code: `
      const greater = (a, b) => {
        if(a > 1) {
          console.scope('greater than');
          return a;
        }

        return b;
      }
      `
    },
    'Switch case return': {
      snapshot: true,
      skip: true,
      code: `
      export default (state = 0, action) => {
        switch(action.type) {
          case 'ADD': {
            console.scope('Add reducer');
            return add(state, 1);
          }

          default: {
            return 0;
          }
        }
      }
      `
    }
  }
});
