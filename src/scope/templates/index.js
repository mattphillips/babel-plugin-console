const buildGroupCollapsed = template => title => template('console.groupCollapsed(title);')({ title });

const buildGroupEnd = template => title => template('console.groupEnd(title);')({ title });

const buildLog = template => (...args) => template('console.log(args);')({ args });

export default template => ({
  buildGroupCollapsed: buildGroupCollapsed(template),
  buildGroupEnd: buildGroupEnd(template),
  buildLog: buildLog(template)
});
