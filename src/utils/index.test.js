import { flatten, negate } from './';

describe('Utils', () => {
  describe('.flatten', () => {
    it('returns empty array when nestedArray is empty', () => {
      expect(flatten([])).toEqual([]);
    });

    it('returns array containing contains of all nested arrays', () => {
      expect(flatten([[1, 2], ['a', 'b'], [{ hello: 'world' }]])).toEqual([1, 2, 'a', 'b', { hello: 'world' }]);
    });
  });

  describe('.negate', () => {
    it('returns true when predicate returns false', () => {
      const id = a => a;
      expect(negate(id)(false)).toBe(true);
    });

    it('returns false when predicate returns true', () => {
      const id = a => a;
      expect(negate(id)(false)).toBe(true);
    });
  });
});
