import * as path from 'path';

import * as globParent from 'glob-parent';
import * as micromatch from 'micromatch';

import {MicromatchOptions, Pattern, PatternRe} from '../types';

const GLOBSTAR      = '**';
const ESCAPE_SYMBOL = '\\';

const COMMON_GLOB_SYMBOLS_RE           = /[*?]|^!/;
const REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[.*]/;
const REGEX_GROUP_SYMBOLS_RE           = /(?:^|[^!*+?@])\(.*\|.*\)/;
const GLOB_EXTENSION_SYMBOLS_RE        = /[!*+?@]\(.*\)/;
const BRACE_EXPANSIONS_SYMBOLS_RE      = /{.*(?:,|\.\.).*}/;

type PatternTypeOptions = {
  braceExpansion?: boolean;
  caseSensitiveMatch?: boolean;
  extglob?: boolean;
};

export function isDynamicPattern(pattern: Pattern, options: PatternTypeOptions = {}): boolean {
  /**
   * When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
   * filepath directly (without read directory).
   */
  if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) {
    return true;
  }

  if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) {
    return true;
  }

  if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) {
    return true;
  }

  if (options.braceExpansion !== false && BRACE_EXPANSIONS_SYMBOLS_RE.test(pattern)) {
    return true;
  }

  return false;
}

export function isStaticPattern(pattern: Pattern, options: PatternTypeOptions = {}): boolean {
  return !isDynamicPattern(pattern, options);
}

export function isNegativePattern(pattern: Pattern): boolean {
  return pattern.startsWith('!') && pattern[1] !== '(';
}

export function convertToPositivePattern(pattern: Pattern): Pattern {
  return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
}

export function convertToNegativePattern(pattern: Pattern): Pattern {
  return '!' + pattern;
}

export function isPositivePattern(pattern: Pattern): boolean {
  return !isNegativePattern(pattern);
}

export function getNegativePatterns(patterns: Pattern[]): Pattern[] {
  return patterns.filter(isNegativePattern);
}

export function getPositivePatterns(patterns: Pattern[]): Pattern[] {
  return patterns.filter(isPositivePattern);
}

export function getBaseDirectory(pattern: Pattern): string {
  return globParent(pattern, {flipBackslashes: false});
}

export function hasGlobStar(pattern: Pattern): boolean {
  return pattern.includes(GLOBSTAR);
}

export function endsWithSlashGlobStar(pattern: Pattern): boolean {
  return pattern.endsWith('/' + GLOBSTAR);
}

export function isAffectDepthOfReadingPattern(pattern: Pattern): boolean {
  const basename = path.basename(pattern);

  return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
}

export function getNaiveDepth(pattern: Pattern): number {
  const base = getBaseDirectory(pattern);

  const patternDepth     = pattern.split('/').length;
  const patternBaseDepth = base.split('/').length;

  if (base === '.') {
    return patternDepth - patternBaseDepth;
  }

  return patternDepth - patternBaseDepth - 1;
}

export function getMaxNaivePatternsDepth(patterns: Pattern[]): number {
  return patterns.reduce((max, pattern) => {
    const depth = getNaiveDepth(pattern);

    return depth > max ? depth : max;
  }, 0);
}

export function makeRe(pattern: Pattern, options: MicromatchOptions): PatternRe {
  return micromatch.makeRe(pattern, options);
}

export function convertPatternsToRe(patterns: Pattern[], options: MicromatchOptions): PatternRe[] {
  return patterns.map((pattern) => makeRe(pattern, options));
}

export function matchAny(entry: string, patternsRe: PatternRe[]): boolean {
  const filepath = entry.replace(/^\.[/\\]/, '');

  return patternsRe.some((patternRe) => patternRe.test(filepath));
}
