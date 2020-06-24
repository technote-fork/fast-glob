import * as assert from 'assert';

import * as tests from '../tests';
import * as util from '../../src/utils/errno';

describe('Utils → Errno', () => {
  describe('.isEnoentCodeError', () => {
    it('should return true for ENOENT error', () => {
      assert.ok(util.isEnoentCodeError(tests.errno.getEnoent()));
    });

    it('should return false for EPERM error', () => {
      assert.ok(!util.isEnoentCodeError(tests.errno.getEperm()));
    });
  });
});
