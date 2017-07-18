<div align="center">
  <h1>babel-plugin-console</h1>

  🎮

  Adds useful build time console functions
</div>

<hr />

[![Build Status](https://img.shields.io/travis/mattphillips/babel-plugin-console.svg?style=flat-square)](https://travis-ci.org/mattphillips/babel-plugin-console)
[![Code Coverage](https://img.shields.io/codecov/c/github/mattphillips/babel-plugin-console.svg?style=flat-square)](https://codecov.io/github/mattphillips/babel-plugin-console)
[![version](https://img.shields.io/npm/v/babel-plugin-console.svg?style=flat-square)](https://www.npmjs.com/package/babel-plugin-console)
[![downloads](https://img.shields.io/npm/dm/babel-plugin-console.svg?style=flat-square)](http://npm-stat.com/charts.html?package=babel-plugin-console&from=2017-07-17)
[![MIT License](https://img.shields.io/npm/l/babel-plugin-console.svg?style=flat-square)](https://github.com/mattphillips/babel-plugin-console/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Roadmap](https://img.shields.io/badge/%F0%9F%93%94-roadmap-CD9523.svg?style=flat-square)](https://github.com/mattphillips/babel-plugin-console/blob/master/docs/ROADMAP.md)
[![Examples](https://img.shields.io/badge/%F0%9F%92%A1-examples-8C8E93.svg?style=flat-square)](https://github.com/mattphillips/babel-plugin-console/blob/master/docs/EXAMPLES.md)

## Problem

Ever find yourself using `console.log` to work out what the heck is going on within your functions?
And then put too many variables into the log and lose context of which value is which variable?

## Solution

These problems can be solved by a computer at build time to inspect a functions parameters, variables, return value and
parent scope and add meaningful logs around the scope of the function.

## Installation

With npm:
```sh
npm install --save-dev babel-plugin-console
```

With yarn:
```sh
yarn add -D babel-plugin-console
```

## Setup

### .babelrc

```json
{
  "plugins": ["console"]
}
```

### CLI

```sh
babel --plugins console script.js
```

### Node

```javascript
require('babel-core').transform('code', {
  plugins: ['console'],
})
```

## APIs

### `console.scope()`

Outputs a collection of messages for a functions entire scope

#### Syntax

```js
console.scope(obj1 [, obj2, ..., objN]);
console.scope(msg [, subst1, ..., substN]);
```

#### Parameters

 - `obj1 ... objN`
A list of JavaScript objects to output. The string representations of each of these objects are appended together in the order listed and output.

 - `msg`
 A JavaScript string containing zero or more substitution strings.

 - `subst1 ... substN`
JavaScript objects with which to replace substitution strings within msg. This gives you additional control over the format of the output.

## Usage

```js
const add100 = (a) => {
  const oneHundred = 100;
  console.scope('Add 100 to another number');
  return add(a, oneHundred);
};

const add = (a, b) => {
  return a + b;
};

      ↓ ↓ ↓ ↓ ↓ ↓

const add100 = a => {
  const oneHundred = 100;
  console.log('Add 100 to another number');
  console.groupCollapsed('(1:6) const add100 = (a) => {...}');
  console.groupCollapsed('Parameters');
  console.log('(1:16)', 'a:', a);
  console.groupEnd('Parameters');
  console.groupCollapsed('Variables');
  console.log('(2:8)', 'oneHundred:', oneHundred);
  console.groupEnd('Variables');
  console.groupCollapsed('Return');
  console.log('(4:9)', add(a, oneHundred));
  console.groupEnd('Return');
  console.groupCollapsed('Script');
  console.log('(1:6)', 'add100:', add100);
  console.log('(7:6)', 'add:', add);
  console.groupEnd('Script');
  console.groupEnd('(1:6) const add100 = (a) => {...}');

  return add(a, oneHundred);
};

const add = (a, b) => {
  return a + b;
};
```

**The generated scope logs for the above function will look like this in a browser:**

![Invoking add100](assets/add100-dark.gif)

## Inspiration

[This tweet](https://twitter.com/kentcdodds/status/885604009930768384) led to me watching
[@kentcdodds's](https://github.com/kentcdodds/) live presentation on ASTs. This plugin is an extension on the
`captains-log` demoed - Thanks Kent!

## LICENSE

MIT
