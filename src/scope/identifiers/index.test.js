import { getParamIdentifiers, getVariableIdentifiers } from './';

describe('Identifiers', () => {
  describe('.getParamIdentifiers', () => {
    it('returns empty array when no bindings kind equals param', () => {
      const bindings = {
        a: {
          kind: 'variable',
          identifier: 'goat'
        },
        b: {
          kind: 'variable',
          identifier: 'penguin'
        }
      };
      expect(getParamIdentifiers(bindings)).toEqual([]);
    });

    it('returns array containing all identifiers when binding kind equal to param', () => {
      const bindings = {
        a: {
          kind: 'variable',
          identifier: 'goat'
        },
        b: {
          kind: 'param',
          identifier: 'penguin'
        }
      };
      expect(getParamIdentifiers(bindings)).toEqual(['penguin']);
    });

    it('returns array containing all identifiers when all bindings kind are equal to param', () => {
      const bindings = {
        a: {
          kind: 'param',
          identifier: 'goat'
        },
        b: {
          kind: 'param',
          identifier: 'penguin'
        }
      };
      expect(getParamIdentifiers(bindings)).toEqual(['goat', 'penguin']);
    });
  });

  describe('.getVariableIdentifiers', () => {
    it('returns empty array when all bindings kind are equal to param', () => {
      const bindings = {
        a: {
          kind: 'param',
          identifier: 'goat'
        },
        b: {
          kind: 'param',
          identifier: 'penguin'
        }
      };
      expect(getVariableIdentifiers(bindings)).toEqual([]);
    });

    it('returns array containing all identifiers when binding kind is not equal to param', () => {
      const bindings = {
        a: {
          kind: 'variable',
          identifier: 'goat'
        },
        b: {
          kind: 'param',
          identifier: 'penguin'
        }
      };
      expect(getVariableIdentifiers(bindings)).toEqual(['goat']);
    });

    it('returns array containing all identifiers when all bindings kind are not equal to param', () => {
      const bindings = {
        a: {
          kind: 'variable',
          identifier: 'goat'
        },
        b: {
          kind: 'variable',
          identifier: 'penguin'
        }
      };
      expect(getVariableIdentifiers(bindings)).toEqual(['goat', 'penguin']);
    });
  });
});
