import * as assert from 'assert';
import * as utils from './utils';

describe('Benchmark → Utils', () => {
  const oldProcessHrtime      = process.hrtime;
  const oldProcessMemoryUsage = process.memoryUsage;

  before(() => {
    process.env.FG_TEST_ENV_INTEGER = '1';
    process.env.FG_TEST_ENV_OBJECT  = '{ "value": true }';

    process.hrtime      = (() => [0, 1e7]) as NodeJS.HRTime;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    process.memoryUsage = (): any => ({external: 0, rss: 0, heapTotal: 0, heapUsed: 10 * 1e6, arrayBuffers: 0});
  });

  after(() => {
    delete process.env.FG_TEST_ENV_INTEGER;
    delete process.env.FG_TEST_ENV_OBJECT;

    process.hrtime      = oldProcessHrtime;
    process.memoryUsage = oldProcessMemoryUsage;
  });

  describe('.convertHrtimeToMilliseconds', () => {
    it('should return milliseconds', () => {
      const hrtime: [number, number] = [0, 1e7];

      const expected = 10;

      const actual = utils.convertHrtimeToMilliseconds(hrtime);

      assert.strictEqual(actual, expected);
    });
  });

  describe('.convertBytesToMegaBytes', () => {
    it('should return megabytes', () => {
      const expected = 1;

      const actual = utils.convertBytesToMegaBytes(1e6);

      assert.strictEqual(actual, expected);
    });
  });

  describe('.timeStart', () => {
    it('should return hrtime', () => {
      const expected: [number, number] = [0, 1e7];

      const actual = utils.timeStart();

      assert.deepStrictEqual(actual, expected);
    });
  });

  describe('.timeEnd', () => {
    it('should return diff between hrtime\'s', () => {
      const expected = 10;

      const actual = utils.timeEnd([0, 1e7]);

      assert.strictEqual(actual, expected);
    });
  });

  describe('.getMemory', () => {
    it('should return memory usage in megabytes', () => {
      const expected = 10;

      const actual = utils.getMemory();

      assert.strictEqual(actual, expected);
    });
  });

  describe('.getMeasures', () => {
    it('should return measures', () => {
      const expected = '{"matches":1,"time":1,"memory":1}';

      const actual = utils.formatMeasures(1, 1, 1);

      assert.strictEqual(actual, expected);
    });
  });

  describe('.getAverageValue', () => {
    it('should return average value for array', () => {
      const expected = 2;

      const actual = utils.getAverageValue([3, 1, 2]);

      assert.strictEqual(actual, expected);
    });
  });

  describe('.getStdev', () => {
    it('should return stdev for array', () => {
      const expected = 1;

      const actual = utils.getStdev([1, 2, 3]);

      assert.strictEqual(actual, expected);
    });
  });

  describe('.getEnvironmentAsString', () => {
    it('should return string', () => {
      const expected = 'text';

      const actual = utils.getEnvironmentAsString('FG_TEST_ENV_STRING', 'text');

      assert.strictEqual(actual, expected);
    });

    it('should return default value', () => {
      const expected = '';

      const actual = utils.getEnvironmentAsString('NON_EXIST_ENV_VARIABLE', '');

      assert.strictEqual(actual, expected);
    });
  });

  describe('.getEnvironmentAsInteger', () => {
    it('should return integer', () => {
      const expected = 1;

      const actual = utils.getEnvironmentAsInteger('FG_TEST_ENV_INTEGER', 0);

      assert.strictEqual(actual, expected);
    });

    it('should return default value', () => {
      const expected = 0;

      const actual = utils.getEnvironmentAsInteger('NON_EXIST_ENV_VARIABLE', 0);

      assert.strictEqual(actual, expected);
    });
  });

  describe('.getEnvironmentAsObject', () => {
    it('should return object', () => {
      const expected = {value: true};

      const actual = utils.getEnvironmentAsObject('FG_TEST_ENV_OBJECT', {});

      assert.deepStrictEqual(actual, expected);
    });

    it('should return default value', () => {
      const expected = {};

      const actual = utils.getEnvironmentAsObject('NON_EXIST_ENV_VARIABLE', {});

      assert.deepStrictEqual(actual, expected);
    });
  });
});
