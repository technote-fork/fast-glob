import * as assert from 'assert';
import * as os from 'os';

import Settings, {DEFAULT_FILE_SYSTEM_ADAPTER} from '../src/settings';

describe('Settings', () => {
  it('should return instance with default values', () => {
    const saveCwd = process.cwd;
    let called    = 0;
    process.cwd   = (): string => String(++called);

    const settings = new Settings();

    assert.deepStrictEqual(settings.fs, DEFAULT_FILE_SYSTEM_ADAPTER);
    assert.deepStrictEqual(settings.ignore, []);
    assert.ok(!settings.absolute);
    assert.ok(!settings.baseNameMatch);
    assert.ok(!settings.dot);
    assert.ok(!settings.markDirectories);
    assert.ok(!settings.objectMode);
    assert.ok(!settings.onlyDirectories);
    assert.ok(!settings.stats);
    assert.ok(!settings.suppressErrors);
    assert.ok(!settings.throwErrorOnBrokenSymbolicLink);
    assert.ok(settings.braceExpansion);
    assert.ok(settings.caseSensitiveMatch);
    assert.ok(settings.deep);
    assert.ok(settings.extglob);
    assert.ok(settings.followSymbolicLinks);
    assert.ok(settings.globstar);
    assert.ok(settings.onlyFiles);
    assert.ok(settings.unique);
    assert.strictEqual(settings.concurrency, os.cpus().length);
    assert.strictEqual(settings.cwd, '1');
    assert.strictEqual(called, 1);

    process.cwd = saveCwd;
  });

  it('should return instance with custom values', () => {
    const saveCwd = process.cwd;
    let called    = 0;
    process.cwd   = (): string => String(++called);

    const settings = new Settings({
      onlyFiles: false,
      cwd: 'test',
    });

    assert.ok(!settings.onlyFiles);
    assert.strictEqual(settings.cwd, 'test');
    assert.strictEqual(called, 0);

    process.cwd = saveCwd;
  });

  it('should set the "onlyFiles" option when the "onlyDirectories" is enabled', () => {
    const settings = new Settings({
      onlyDirectories: true,
    });

    assert.ok(!settings.onlyFiles);
    assert.ok(settings.onlyDirectories);
  });

  it('should set the "objectMode" option when the "stats" is enabled', () => {
    const settings = new Settings({
      stats: true,
    });

    assert.ok(settings.objectMode);
    assert.ok(settings.stats);
  });

  it('should return the `fs` option with custom method', () => {
    const customReaddirSync = (): never[] => [];

    const settings = new Settings({
      fs: {readdirSync: customReaddirSync},
    });

    assert.strictEqual(settings.fs.readdirSync, customReaddirSync);
  });
});
