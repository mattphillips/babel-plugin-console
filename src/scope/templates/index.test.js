import each from 'jest-each';

import templateHelpers from './';

describe('Templates', () => {
  const noop = () => {};

  describe('.buildGroupCollapsed', () => {
    each([[0], [1], [2], [3]]).it('calls template with correct string and indentation level: %d', level => {
      const template = jest.fn(() => noop);
      const { buildGroupCollapsed } = templateHelpers(template);
      buildGroupCollapsed('bob')(level);
      expect(template.mock.calls[0][0]).toMatchSnapshot();
    });

    it('invokes template with given title as an object', () => {
      const template = () => templateCurry;
      const templateCurry = jest.fn();
      const { buildGroupCollapsed } = templateHelpers(template);
      buildGroupCollapsed('matt')(0);
      expect(templateCurry).toHaveBeenCalledWith({ TITLE: 'matt' });
    });

    it('returns value from invoking template', () => {
      const template = () => () => 'hello world';
      const { buildGroupCollapsed } = templateHelpers(template);
      expect(buildGroupCollapsed('matt', 'woz', 'ere')(0)).toBe('hello world');
    });
  });

  describe('.buildGroupEnd', () => {
    it('calls template with correct string', () => {
      const template = jest.fn(() => noop);
      const { buildGroupEnd } = templateHelpers(template);
      buildGroupEnd('bob');
      expect(template.mock.calls[0][0]).toMatchSnapshot();
    });

    it('invokes template with given title as an object', () => {
      const template = () => templateCurry;
      const templateCurry = jest.fn();
      const { buildGroupEnd } = templateHelpers(template);
      buildGroupEnd('matt');
      expect(templateCurry).toHaveBeenCalledWith({ TITLE: 'matt' });
    });

    it('returns value from invoking template', () => {
      const template = () => () => 'hello world';
      const { buildGroupEnd } = templateHelpers(template);
      expect(buildGroupEnd('matt', 'woz', 'ere')).toBe('hello world');
    });
  });

  describe('.buildLog', () => {
    it('calls template with console log string when indentation level is 0', () => {
      const template = jest.fn(() => noop);
      const { buildLog } = templateHelpers(template);
      buildLog('bob', 'woz', 'ere')(0);
      expect(template).toHaveBeenCalledWith('console.log(ARGS);');
    });

    each([[1], [2], [3]]).it('calls template with correct string and indentation level: %d', level => {
      const template = jest.fn(() => noop);
      const { buildLog } = templateHelpers(template);
      buildLog('bob', 'woz', 'ere')(level);
      expect(template.mock.calls[0][0]).toMatchSnapshot();
    });

    it('invokes template with given args as an object', () => {
      const template = () => templateCurry;
      const templateCurry = jest.fn();
      const { buildLog } = templateHelpers(template);
      buildLog('matt', 'woz', 'ere')(0);
      expect(templateCurry).toHaveBeenCalledWith({ ARGS: ['matt', 'woz', 'ere'] });
    });

    it('returns value from invoking template', () => {
      const template = () => () => 'hello world';
      const { buildLog } = templateHelpers(template);
      expect(buildLog('matt', 'woz', 'ere')(0)).toBe('hello world');
    });
  });
});
