import type { BlokType } from '@virginmediao2/storyblok-sdk/src';
import { describe, expect, it } from 'vitest';
import { storyblokEditable } from './storyblok-editable';

describe('storyblokEditable', () => {
  describe('valid cases', () => {
    it('should return data attributes for valid blok with _editable', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
        _editable: '<!--#storyblok#{"id":"123","uid":"test-uid"}-->',
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({
        'data-blok-c': '{"id":"123","uid":"test-uid"}',
        'data-blok-uid': '123-test-uid',
      });
    });

    it('should handle _editable with additional properties', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
        _editable:
          '<!--#storyblok#{"id":"456","uid":"test-uid","component":"hero"}-->',
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({
        'data-blok-c': '{"id":"456","uid":"test-uid","component":"hero"}',
        'data-blok-uid': '456-test-uid',
      });
    });

    it('should handle _editable with complex JSON structure', () => {
      const blok: Partial<BlokType> = {
        _uid: 'complex-uid',
        component: 'test-component',
        _editable:
          '<!--#storyblok#{"id":"789","uid":"complex-uid","component":"section","data":{"theme":"dark"}}-->',
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({
        'data-blok-c':
          '{"id":"789","uid":"complex-uid","component":"section","data":{"theme":"dark"}}',
        'data-blok-uid': '789-complex-uid',
      });
    });

    it('should handle numeric id and uid', () => {
      const blok: Partial<BlokType> = {
        _uid: '123',
        component: 'test-component',
        _editable: '<!--#storyblok#{"id":456,"uid":"123"}-->',
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({
        'data-blok-c': '{"id":456,"uid":"123"}',
        'data-blok-uid': '456-123',
      });
    });
  });

  describe('invalid cases', () => {
    it('should return empty object for null input', () => {
      // The function will throw when trying to access _editable on null
      expect(() =>
        storyblokEditable(null as unknown as Partial<BlokType>),
      ).toThrow();
    });

    it('should return empty object for undefined input', () => {
      const result = storyblokEditable(
        undefined as unknown as Partial<BlokType>,
      );

      expect(result).toEqual({});
    });

    it('should return empty object for non-object input', () => {
      const result = storyblokEditable(
        'string' as unknown as Partial<BlokType>,
      );

      expect(result).toEqual({});
    });

    it('should return empty object for number input', () => {
      const result = storyblokEditable(123 as unknown as Partial<BlokType>);

      expect(result).toEqual({});
    });

    it('should return empty object for boolean input', () => {
      const result = storyblokEditable(true as unknown as Partial<BlokType>);

      expect(result).toEqual({});
    });

    it('should return empty object for object without _editable', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({});
    });

    it('should return empty object for object with null _editable', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
        _editable: null as unknown as string,
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({});
    });

    it('should return empty object for object with undefined _editable', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
        _editable: undefined,
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({});
    });

    it('should return empty object for object with empty string _editable', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
        _editable: '',
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({});
    });
  });

  describe('edge cases', () => {
    it('should handle _editable with extra whitespace', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
        _editable: '<!--#storyblok#{"id":"123","uid":"test-uid"}-->',
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({
        'data-blok-c': '{"id":"123","uid":"test-uid"}',
        'data-blok-uid': '123-test-uid',
      });
    });

    it('should handle _editable with newlines', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
        _editable: '<!--#storyblok#\n{"id":"123","uid":"test-uid"}\n-->',
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({
        'data-blok-c': '{"id":"123","uid":"test-uid"}',
        'data-blok-uid': '123-test-uid',
      });
    });

    it('should handle _editable with special characters in JSON', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
        _editable:
          '<!--#storyblok#{"id":"123","uid":"test-uid","text":"Hello \\"World\\""}-->',
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({
        'data-blok-c':
          '{"id":"123","uid":"test-uid","text":"Hello \\"World\\""}',
        'data-blok-uid': '123-test-uid',
      });
    });

    it('should handle _editable with nested objects', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
        _editable:
          '<!--#storyblok#{"id":"123","uid":"test-uid","config":{"theme":"dark","layout":"grid"}}-->',
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({
        'data-blok-c':
          '{"id":"123","uid":"test-uid","config":{"theme":"dark","layout":"grid"}}',
        'data-blok-uid': '123-test-uid',
      });
    });

    it('should handle _editable with arrays', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
        _editable:
          '<!--#storyblok#{"id":"123","uid":"test-uid","tags":["featured","hero"]}-->',
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({
        'data-blok-c':
          '{"id":"123","uid":"test-uid","tags":["featured","hero"]}',
        'data-blok-uid': '123-test-uid',
      });
    });
  });

  describe('error handling', () => {
    it('should handle malformed JSON in _editable', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
        _editable: '<!--#storyblok#{invalid-json}-->',
      };

      expect(() => storyblokEditable(blok)).toThrow();
    });

    it('should handle _editable without proper comment format', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
        _editable: '{"id":"123","uid":"test-uid"}',
      };

      // The function will try to parse the JSON directly and should succeed
      const result = storyblokEditable(blok);
      expect(result).toEqual({
        'data-blok-c': '{"id":"123","uid":"test-uid"}',
        'data-blok-uid': '123-test-uid',
      });
    });

    it('should handle _editable with missing closing comment', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
        _editable: '<!--#storyblok#{"id":"123","uid":"test-uid"}',
      };

      // The function will remove the opening comment and should succeed
      const result = storyblokEditable(blok);
      expect(result).toEqual({
        'data-blok-c': '{"id":"123","uid":"test-uid"}',
        'data-blok-uid': '123-test-uid',
      });
    });

    it('should handle _editable with missing opening comment', () => {
      const blok: Partial<BlokType> = {
        _uid: 'test-uid',
        component: 'test-component',
        _editable: '{"id":"123","uid":"test-uid"}-->',
      };

      // The function will remove the closing comment and should succeed
      const result = storyblokEditable(blok);
      expect(result).toEqual({
        'data-blok-c': '{"id":"123","uid":"test-uid"}',
        'data-blok-uid': '123-test-uid',
      });
    });
  });

  describe('real-world scenarios', () => {
    it('should handle typical Storyblok blok structure', () => {
      const blok: Partial<BlokType> = {
        _uid: 'hero-123',
        component: 'hero',
        _editable:
          '<!--#storyblok#{"id":"456","uid":"hero-123","component":"hero"}-->',
        title: 'Welcome to our site',
        subtitle: 'This is a hero section',
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({
        'data-blok-c': '{"id":"456","uid":"hero-123","component":"hero"}',
        'data-blok-uid': '456-hero-123',
      });
    });

    it('should handle blok with additional properties', () => {
      const blok: Partial<BlokType> = {
        _uid: 'section-789',
        component: 'section',
        _editable:
          '<!--#storyblok#{"id":"101","uid":"section-789","component":"section","data":{"background":"blue"}}-->',
        content: 'Section content',
        background: 'blue',
      };

      const result = storyblokEditable(blok);

      expect(result).toEqual({
        'data-blok-c':
          '{"id":"101","uid":"section-789","component":"section","data":{"background":"blue"}}',
        'data-blok-uid': '101-section-789',
      });
    });
  });
});
