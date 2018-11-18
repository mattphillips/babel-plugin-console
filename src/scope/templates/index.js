const buildGroupCollapsed = template => TITLE => level => {
  const indentation = indentWith(level, '| ', '▼ ');

  return template(`
    if (typeof window !== 'undefined') {
      console.groupCollapsed(TITLE);
    } else {
      console.log('${indentation}', TITLE);
    }
  `)({ TITLE });
};

const buildGroupEnd = template => TITLE =>
  template(`
  if (typeof window !== 'undefined') {
    console.groupEnd(TITLE);
  }
`)({ TITLE });

const buildLog = template => (...ARGS) => level => {
  if (level == 0) {
    return template('console.log(ARGS);')({ ARGS });
  }

  const indentation = indentWith(level, '| ', '| ');
  return template(`
    if (typeof window !== 'undefined') {
      console.log(ARGS);
    } else {
      console.log('${indentation}', ARGS);

    }
  `)({ ARGS });
};

const indentWith = (level, str, initial) => Array.from({ length: level }).reduce(acc => `${str}${acc}`, initial);

export default template => ({
  buildGroupCollapsed: buildGroupCollapsed(template),
  buildGroupEnd: buildGroupEnd(template),
  buildLog: buildLog(template)
});
