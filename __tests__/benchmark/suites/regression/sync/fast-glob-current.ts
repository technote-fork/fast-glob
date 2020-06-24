import * as path from 'path';

import * as glob from '../../..';
import * as utils from '../../../utils';

const options: glob.Options = {
  cwd: path.join(process.cwd(), process.env.BENCHMARK_BASE_DIR as string),
  unique: false,
  ...JSON.parse(process.env.BENCHMARK_OPTIONS as string),
};

const timeStart = utils.timeStart();

try {
  const matches  = glob.sync(process.env.BENCHMARK_PATTERN as string, options);
  const memory   = utils.getMemory();
  const time     = utils.timeEnd(timeStart);
  const measures = utils.formatMeasures(matches.length, time, memory);

  console.info(measures);
} catch {
  process.exit(0);
}
