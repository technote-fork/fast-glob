import * as assert from 'assert';

import {Pattern} from '../../src/types';
import * as util from '../../src/utils/pattern';

describe('Utils → Pattern', () => {
  describe('.isStaticPattern', () => {
    it('should return true for static pattern', () => {
      const actual = util.isStaticPattern('dir');

      assert.ok(actual);
    });

    it('should return false for dynamic pattern', () => {
      const actual = util.isStaticPattern('*');

      assert.ok(!actual);
    });
  });

  describe('.isDynamicPattern', () => {
    describe('Without options', () => {
      it('should return true for patterns that include the escape symbol', () => {
        assert.ok(util.isDynamicPattern('\\'));
      });

      it('should return true for patterns that include common glob symbols', () => {
        assert.ok(util.isDynamicPattern('*'));
        assert.ok(util.isDynamicPattern('abc/*'));
        assert.ok(util.isDynamicPattern('?'));
        assert.ok(util.isDynamicPattern('abc/?'));
        assert.ok(util.isDynamicPattern('!abc'));
      });

      it('should return true for patterns that include regex group symbols', () => {
        assert.ok(util.isDynamicPattern('(a|)'));
        assert.ok(util.isDynamicPattern('(a|b)'));
        assert.ok(util.isDynamicPattern('abc/(a|b)'));
      });

      it('should return true for patterns that include regex character class symbols', () => {
        assert.ok(util.isDynamicPattern('[abc]'));
        assert.ok(util.isDynamicPattern('abc/[abc]'));
        assert.ok(util.isDynamicPattern('[^abc]'));
        assert.ok(util.isDynamicPattern('abc/[^abc]'));
        assert.ok(util.isDynamicPattern('[1-3]'));
        assert.ok(util.isDynamicPattern('abc/[1-3]'));
        assert.ok(util.isDynamicPattern('[[:alpha:][:digit:]]'));
        assert.ok(util.isDynamicPattern('abc/[[:alpha:][:digit:]]'));
      });

      it('should return true for patterns that include glob extension symbols', () => {
        assert.ok(util.isDynamicPattern('@()'));
        assert.ok(util.isDynamicPattern('@(a)'));
        assert.ok(util.isDynamicPattern('@(a|b)'));
        assert.ok(util.isDynamicPattern('abc/!(a|b)'));
        assert.ok(util.isDynamicPattern('*(a|b)'));
        assert.ok(util.isDynamicPattern('?(a|b)'));
        assert.ok(util.isDynamicPattern('+(a|b)'));
      });

      it('should return true for patterns that include brace expansions symbols', () => {
        assert.ok(util.isDynamicPattern('{,}'));
        assert.ok(util.isDynamicPattern('{a,}'));
        assert.ok(util.isDynamicPattern('{,b}'));
        assert.ok(util.isDynamicPattern('{a,b}'));
        assert.ok(util.isDynamicPattern('{1..3}'));
      });

      it('should return false for "!" symbols when a symbol is not specified first in the string', () => {
        assert.ok(!util.isDynamicPattern('abc!'));
      });

      it('should return false for a completely static pattern', () => {
        assert.ok(!util.isDynamicPattern(''));
        assert.ok(!util.isDynamicPattern('.'));
        assert.ok(!util.isDynamicPattern('abc'));
        assert.ok(!util.isDynamicPattern('~abc'));
        assert.ok(!util.isDynamicPattern('~/abc'));
        assert.ok(!util.isDynamicPattern('+~/abc'));
        assert.ok(!util.isDynamicPattern('@.(abc)'));
        assert.ok(!util.isDynamicPattern('(a b)'));
        assert.ok(!util.isDynamicPattern('(a b)'));
        assert.ok(!util.isDynamicPattern('[abc'));
      });

      it('should return false for unfinished regex character class', () => {
        assert.ok(!util.isDynamicPattern('['));
        assert.ok(!util.isDynamicPattern('[abc'));
      });

      it('should return false for unfinished regex group', () => {
        assert.ok(!util.isDynamicPattern('(a|b'));
        assert.ok(!util.isDynamicPattern('abc/(a|b'));
      });

      it('should return false for unfinished glob extension', () => {
        assert.ok(!util.isDynamicPattern('@('));
        assert.ok(!util.isDynamicPattern('@(a'));
        assert.ok(!util.isDynamicPattern('@(a|'));
        assert.ok(!util.isDynamicPattern('@(a|b'));
      });

      it('should return false for unfinished brace expansions', () => {
        assert.ok(!util.isDynamicPattern('{'));
        assert.ok(!util.isDynamicPattern('{a'));
        assert.ok(!util.isDynamicPattern('{,'));
        assert.ok(!util.isDynamicPattern('{a,'));
        assert.ok(!util.isDynamicPattern('{a,b'));
      });
    });

    describe('With options', () => {
      it('should return true for patterns that include "*?" symbols even when the "extglob" option is disabled', () => {
        assert.ok(util.isDynamicPattern('*(a|b)', {extglob: false}));
        assert.ok(util.isDynamicPattern('?(a|b)', {extglob: false}));
      });

      it('should return true when the "caseSensitiveMatch" option is enabled', () => {
        assert.ok(util.isDynamicPattern('a', {caseSensitiveMatch: false}));
      });

      it('should return false for glob extension when the "extglob" option is disabled', () => {
        assert.ok(!util.isDynamicPattern('@(a|b)', {extglob: false}));
        assert.ok(!util.isDynamicPattern('abc/!(a|b)', {extglob: false}));
        assert.ok(!util.isDynamicPattern('+(a|b)', {extglob: false}));
      });

      it('should return false for brace expansions when the "braceExpansion" option is disabled', () => {
        assert.ok(!util.isDynamicPattern('{a,b}', {braceExpansion: false}));
        assert.ok(!util.isDynamicPattern('{1..3}', {braceExpansion: false}));
      });
    });
  });

  describe('.convertToPositivePattern', () => {
    it('should returns converted positive pattern', () => {
      const expected = '*.js';

      const actual = util.convertToPositivePattern('!*.js');

      assert.strictEqual(actual, expected);
    });

    it('should returns pattern without changes', () => {
      const expected = '*.js';

      const actual = util.convertToPositivePattern('*.js');

      assert.strictEqual(actual, expected);
    });
  });

  describe('.convertToNegativePattern', () => {
    it('should returns converted negative pattern', () => {
      const expected = '!*.js';

      const actual = util.convertToNegativePattern('*.js');

      assert.strictEqual(actual, expected);
    });
  });

  describe('.isNegativePattern', () => {
    it('should returns true', () => {
      const actual = util.isNegativePattern('!*.md');

      assert.ok(actual);
    });

    it('should returns false', () => {
      const actual = util.isNegativePattern('*.md');

      assert.ok(!actual);
    });

    it('should returns false for extglob', () => {
      const actual = util.isNegativePattern('!(a|b|c)');

      assert.ok(!actual);
    });
  });

  describe('.isPositivePattern', () => {
    it('should returns true', () => {
      const actual = util.isPositivePattern('*.md');

      assert.ok(actual);
    });

    it('should returns false', () => {
      const actual = util.isPositivePattern('!*.md');

      assert.ok(!actual);
    });
  });

  describe('.getNegativePatterns', () => {
    it('should returns only negative patterns', () => {
      const expected = ['!*.spec.js'];

      const actual = util.getNegativePatterns(['*.js', '!*.spec.js', '*.ts']);

      assert.deepStrictEqual(actual, expected);
    });

    it('should returns empty array', () => {
      const expected: Pattern[] = [];

      const actual = util.getNegativePatterns(['*.js', '*.ts']);

      assert.deepStrictEqual(actual, expected);
    });
  });

  describe('.getPositivePatterns', () => {
    it('should returns only positive patterns', () => {
      const expected = ['*.js', '*.ts'];

      const actual = util.getPositivePatterns(['*.js', '!*.spec.js', '*.ts']);

      assert.deepStrictEqual(actual, expected);
    });

    it('should returns empty array', () => {
      const expected: Pattern[] = [];

      const actual = util.getPositivePatterns(['!*.js', '!*.ts']);

      assert.deepStrictEqual(actual, expected);
    });
  });

  describe('.getBaseDirectory', () => {
    it('should returns base directory', () => {
      const expected = 'root';

      const actual = util.getBaseDirectory('root/*.js');

      assert.strictEqual(actual, expected);
    });

    it('should returns base directory without slash transformation', () => {
      const expected = '.';

      const actual = util.getBaseDirectory('file-\\(suffix\\).md');

      assert.strictEqual(actual, expected);
    });
  });

  describe('.hasGlobStar', () => {
    it('should returns true for pattern that includes globstar', () => {
      const actual = util.hasGlobStar('**/*.js');

      assert.ok(actual);
    });

    it('should returns false for pattern that has no globstar', () => {
      const actual = util.hasGlobStar('*.js');

      assert.ok(!actual);
    });
  });

  describe('.endsWithSlashGlobStar', () => {
    it('should returns true for pattern that ends with slash and globstar', () => {
      const actual = util.endsWithSlashGlobStar('name/**');

      assert.ok(actual);
    });

    it('should returns false for pattern that has no slash, but ends with globstar', () => {
      const actual = util.endsWithSlashGlobStar('**');

      assert.ok(!actual);
    });

    it('should returns false for pattern that does not ends with globstar', () => {
      const actual = util.endsWithSlashGlobStar('name/**/*');

      assert.ok(!actual);
    });
  });

  describe('.isAffectDepthOfReadingPattern', () => {
    it('should return true for pattern that ends with slash and globstar', () => {
      const actual = util.isAffectDepthOfReadingPattern('name/**');

      assert.ok(actual);
    });

    it('should return true for pattern when the last partial of the pattern is static pattern', () => {
      const actual = util.isAffectDepthOfReadingPattern('**/name');

      assert.ok(actual);
    });

    it('should return false', () => {
      const actual = util.isAffectDepthOfReadingPattern('**/name/*');

      assert.ok(!actual);
    });
  });

  describe('.getNaiveDepth', () => {
    it('should return 0', () => {
      const expected = 0; // 1 (pattern) - 1 (base directory)

      const actual = util.getNaiveDepth('*.js');

      assert.strictEqual(actual, expected);
    });

    it('should returns 1', () => {
      const expected = 1; // 4 (pattern) - 2 (base directory) - 1

      const actual = util.getNaiveDepth('a/b/*/*.js');

      assert.strictEqual(actual, expected);
    });
  });

  describe('.getMaxNaivePatternsDepth', () => {
    it('should return 1', () => {
      const expected = 1;

      const actual = util.getMaxNaivePatternsDepth(['*.js', './*.js']);

      assert.strictEqual(actual, expected);
    });

    it('should return 2', () => {
      const expected = 2;

      const actual = util.getMaxNaivePatternsDepth(['*.js', './*/*.js']);

      assert.strictEqual(actual, expected);
    });
  });

  describe('.makeRE', () => {
    it('should return regexp for provided pattern', () => {
      const actual = util.makeRe('*.js', {});

      assert.ok(actual instanceof RegExp);
    });
  });

  describe('.convertPatternsToRe', () => {
    it('should return regexps for provided patterns', () => {
      const [actual] = util.convertPatternsToRe(['*.js'], {});

      assert.ok(actual instanceof RegExp);
    });
  });
  describe('.matchAny', () => {
    it('should return true', () => {
      const actual = util.matchAny('fixtures/nested/file.txt', [/fixture/, /fixtures\/nested\/file/]);

      assert.ok(actual);
    });

    it('should return false', () => {
      const actual = util.matchAny('fixtures/directory', [/fixtures\/file/]);

      assert.ok(!actual);
    });

    it('should return true for path with leading slash', () => {
      const pattern = util.makeRe('*.js', {});

      const actual = util.matchAny('./test.js', [pattern]);

      assert.ok(actual);
    });
  });
});
