import { describe, expect, it } from 'vitest';
import { type Colors, coerceBgColor, coerceTextColor } from './coerce-colour';

describe('coerceTextColor', () => {
  it('should return text-neutral for neutral', () => {
    expect(coerceTextColor('neutral')).toBe('text-neutral');
  });

  it('should return text-primary for primary', () => {
    expect(coerceTextColor('primary')).toBe('text-primary');
  });

  it('should return text-secondary for secondary', () => {
    expect(coerceTextColor('secondary')).toBe('text-secondary');
  });

  it('should return text-accent for accent', () => {
    expect(coerceTextColor('accent')).toBe('text-accent');
  });

  it('should return text-success for success', () => {
    expect(coerceTextColor('success')).toBe('text-success');
  });

  it('should return text-warning for warning', () => {
    expect(coerceTextColor('warning')).toBe('text-warning');
  });

  it('should return text-info for info', () => {
    expect(coerceTextColor('info')).toBe('text-info');
  });

  it('should return text-error for error', () => {
    expect(coerceTextColor('error')).toBe('text-error');
  });

  it('should return text-default for default', () => {
    expect(coerceTextColor('default')).toBe('text-default');
  });

  it('should return text-default for unknown color', () => {
    expect(coerceTextColor('unknown' as Colors)).toBe('text-default');
  });
});

describe('coerceBgColor', () => {
  it('should return bg-neutral for neutral', () => {
    expect(coerceBgColor('neutral')).toBe('bg-neutral');
  });

  it('should return bg-primary for primary', () => {
    expect(coerceBgColor('primary')).toBe('bg-primary');
  });

  it('should return bg-secondary for secondary', () => {
    expect(coerceBgColor('secondary')).toBe('bg-secondary');
  });

  it('should return bg-accent for accent', () => {
    expect(coerceBgColor('accent')).toBe('bg-accent');
  });

  it('should return bg-success for success', () => {
    expect(coerceBgColor('success')).toBe('bg-success');
  });

  it('should return bg-warning for warning', () => {
    expect(coerceBgColor('warning')).toBe('bg-warning');
  });

  it('should return bg-info for info', () => {
    expect(coerceBgColor('info')).toBe('bg-info');
  });

  it('should return bg-error for error', () => {
    expect(coerceBgColor('error')).toBe('bg-error');
  });

  it('should return bg-default for default', () => {
    expect(coerceBgColor('default')).toBe('bg-default');
  });

  it('should return bg-default for unknown color', () => {
    expect(coerceBgColor('unknown' as Colors)).toBe('bg-default');
  });
});
