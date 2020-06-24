import * as assert from 'assert';

import * as util from '../../src/utils/string';

describe('Utils → String', () => {
  describe('.isString', () => {
    it('should return true', () => {
      const actual = util.isString('');

      assert.ok(actual);
    });

    it('should return false', () => {
      const actual = util.isString(undefined as unknown as string);

      assert.ok(!actual);
    });
  });

  describe('.isEmpty', () => {
    it('should return true', () => {
      const actual = util.isEmpty('');

      assert.ok(actual);
    });

    it('should return false', () => {
      const actual = util.isEmpty('string');

      assert.ok(!actual);
    });
  });
});
