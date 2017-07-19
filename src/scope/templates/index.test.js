import templateHelpers from './';

describe('Templates', () => {
  const noop = () => {};

  describe('.buildGroupCollapsed', () => {
    it('calls template with correct string', () => {
      const template = jest.fn(() => noop);
      const { buildGroupCollapsed } = templateHelpers(template);
      buildGroupCollapsed('bob');
      expect(template).toHaveBeenCalledWith('console.groupCollapsed(title);');
    });

    it('invokes template with given title as an object', () => {
      const template = () => templateCurry;
      const templateCurry = jest.fn();
      const { buildGroupCollapsed } = templateHelpers(template);
      buildGroupCollapsed('matt');
      expect(templateCurry).toHaveBeenCalledWith({ title: 'matt' });
    });

    it('returns value from invoking template', () => {
      const template = () => () => 'hello world';
      const { buildGroupCollapsed } = templateHelpers(template);
      expect(buildGroupCollapsed('matt', 'woz', 'ere')).toBe('hello world');
    });
  });

  describe('.buildGroupEnd', () => {
    it('calls template with correct string', () => {
      const template = jest.fn(() => noop);
      const { buildGroupEnd } = templateHelpers(template);
      buildGroupEnd('bob');
      expect(template).toHaveBeenCalledWith('console.groupEnd(title);');
    });

    it('invokes template with given title as an object', () => {
      const template = () => templateCurry;
      const templateCurry = jest.fn();
      const { buildGroupEnd } = templateHelpers(template);
      buildGroupEnd('matt');
      expect(templateCurry).toHaveBeenCalledWith({ title: 'matt' });
    });

    it('returns value from invoking template', () => {
      const template = () => () => 'hello world';
      const { buildGroupEnd } = templateHelpers(template);
      expect(buildGroupEnd('matt', 'woz', 'ere')).toBe('hello world');
    });
  });

  describe('.buildLog', () => {
    it('calls template with correct string', () => {
      const template = jest.fn(() => noop);
      const { buildLog } = templateHelpers(template);
      buildLog('bob');
      expect(template).toHaveBeenCalledWith('console.log(args);');
    });

    it('invokes template with given args as an object', () => {
      const template = () => templateCurry;
      const templateCurry = jest.fn();
      const { buildLog } = templateHelpers(template);
      buildLog('matt', 'woz', 'ere');
      expect(templateCurry).toHaveBeenCalledWith({ args: ['matt', 'woz', 'ere'] });
    });

    it('returns value from invoking template', () => {
      const template = () => () => 'hello world';
      const { buildLog } = templateHelpers(template);
      expect(buildLog('matt', 'woz', 'ere')).toBe('hello world');
    });
  });
});
