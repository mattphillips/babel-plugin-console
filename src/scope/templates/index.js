const buildGroupCollapsed = template => title => level => {
  const indentation = indentWith(level, '| ', '▼ ');

  return template(`
    if (typeof window !== 'undefined') {
      console.groupCollapsed(title);
    } else {
      console.log('${indentation}', title);
    }
  `)({ title });
};

const buildGroupEnd = template => title =>
  template(`
  if (typeof window !== 'undefined') {
    console.groupEnd(title);
  }
`)({ title });

const buildLog = template => (...args) => level => {
  if (level == 0) {
    return template('console.log(args);')({ args });
  }

  const indentation = indentWith(level, '| ', '| ');
  return template(`
    if (typeof window !== 'undefined') {
      console.log(args);
    } else {
      console.log('${indentation}', args);

    }
  `)({ args });
};

const indentWith = (level, str, initial) => Array.from({ length: level }).reduce(acc => `${str}${acc}`, initial);

export default template => ({
  buildGroupCollapsed: buildGroupCollapsed(template),
  buildGroupEnd: buildGroupEnd(template),
  buildLog: buildLog(template)
});
