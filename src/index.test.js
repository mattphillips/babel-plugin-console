import path from 'path';
import pluginTester from 'babel-plugin-tester';
import plugin from './';

const projectRoot = path.join(__dirname, '../../');

// expect.addSnapshotSerializer({
//   print(val) {
//     return val.split(projectRoot).join('<PROJECT_ROOT>/')
//   },
//   test(val) {
//     return typeof val === 'string'
//   },
// })

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
    }
  }
});

// function fixture(filename) {
//   return require.resolve(`./fixtures/${filename}`)
// }
