import { describe, expect, it } from 'vitest';
import { type Colors, coerceBgColor, coerceTextColor } from './coerce-colour';

describe('coerce-colour', () => {
  describe('coerceTextColor', () => {
    it('returns correct text class for each color', () => {
      const testCases: Array<[Colors, string]> = [
        ['default', 'text-default'],
        ['neutral', 'text-neutral'],
        ['primary', 'text-primary'],
        ['secondary', 'text-secondary'],
        ['accent', 'text-accent'],
        ['success', 'text-success'],
        ['warning', 'text-warning'],
        ['info', 'text-info'],
        ['error', 'text-error'],
      ];

      testCases.forEach(([color, expected]) => {
        expect(coerceTextColor(color)).toBe(expected);
      });
    });
  });

  describe('coerceBgColor', () => {
    it('returns correct background class for each color', () => {
      const testCases: Array<[Colors, string]> = [
        ['default', 'bg-default'],
        ['neutral', 'bg-neutral'],
        ['primary', 'bg-primary'],
        ['secondary', 'bg-secondary'],
        ['accent', 'bg-accent'],
        ['success', 'bg-success'],
        ['warning', 'bg-warning'],
        ['info', 'bg-info'],
        ['error', 'bg-error'],
      ];

      testCases.forEach(([color, expected]) => {
        expect(coerceBgColor(color)).toBe(expected);
      });
    });
  });
});
