const flatten = nestedArray => nestedArray.reduce((acc, arr) => acc.concat(...arr), []);
const negate = predicate => x => !predicate(x);

export { flatten, negate };
