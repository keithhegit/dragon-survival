import { describe, test, expect } from 'vitest/dist/index.js';
import { Vector2D } from '../Vector2D';

describe('Vector2D', () => {
  // 基础功能测试
  describe('Basic Operations', () => {
    test('should create vector with default values', () => {
      const v = new Vector2D();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
    });

    test('should create vector with specified values', () => {
      const v = new Vector2D(1, 2);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
    });

    test('should clone vector correctly', () => {
      const original = new Vector2D(1, 2);
      const cloned = original.clone();
      expect(cloned).not.toBe(original); // 不是同一个对象
      expect(cloned.x).toBe(original.x);
      expect(cloned.y).toBe(original.y);
    });
  });

  // 数学运算测试
  describe('Mathematical Operations', () => {
    test('should add vectors correctly', () => {
      const v1 = new Vector2D(1, 2);
      const v2 = new Vector2D(2, 3);
      const result = v1.add(v2);
      expect(result.x).toBe(3);
      expect(result.y).toBe(5);
    });

    test('should subtract vectors correctly', () => {
      const v1 = new Vector2D(3, 5);
      const v2 = new Vector2D(1, 2);
      const result = v1.subtract(v2);
      expect(result.x).toBe(2);
      expect(result.y).toBe(3);
    });

    test('should multiply by scalar correctly', () => {
      const v = new Vector2D(2, 3);
      const result = v.multiply(2);
      expect(result.x).toBe(4);
      expect(result.y).toBe(6);
    });

    test('should calculate dot product correctly', () => {
      const v1 = new Vector2D(1, 2);
      const v2 = new Vector2D(3, 4);
      expect(v1.dot(v2)).toBe(11); // 1*3 + 2*4
    });
  });

  // 标准化测试
  describe('Normalization', () => {
    test('should normalize vector correctly', () => {
      const v = new Vector2D(3, 4);
      const normalized = v.normalize();
      expect(normalized.length()).toBeCloseTo(1);
      expect(normalized.x).toBeCloseTo(0.6);
      expect(normalized.y).toBeCloseTo(0.8);
    });

    test('should handle zero vector normalization', () => {
      const v = new Vector2D(0, 0);
      const normalized = v.normalize();
      expect(normalized.x).toBe(0);
      expect(normalized.y).toBe(0);
    });
  });

  // 网格转换测试
  describe('Grid Conversions', () => {
    test('should convert to grid coordinates', () => {
      const v = new Vector2D(32, 48);
      const gridPos = v.toGrid(16);
      expect(gridPos.x).toBe(2);
      expect(gridPos.y).toBe(3);
    });

    test('should convert from grid to world coordinates', () => {
      const v = Vector2D.fromGrid(2, 3, 16);
      expect(v.x).toBe(40); // 2 * 16 + 8
      expect(v.y).toBe(56); // 3 * 16 + 8
    });

    test('should handle negative coordinates in grid conversion', () => {
      const v = new Vector2D(-32, -48);
      const gridPos = v.toGrid(16);
      expect(gridPos.x).toBe(-2);
      expect(gridPos.y).toBe(-3);
    });
  });

  // 边界情况测试
  describe('Edge Cases', () => {
    test('should handle very large numbers', () => {
      const v = new Vector2D(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
      expect(() => v.length()).not.toThrow();
    });

    test('should handle very small numbers', () => {
      const v = new Vector2D(Number.MIN_VALUE, Number.MIN_VALUE);
      expect(() => v.normalize()).not.toThrow();
    });
  });

  // 新添加的测试用例
  describe('Additional Operations', () => {
    test('should perform linear interpolation', () => {
      const v1 = new Vector2D(0, 0);
      const v2 = new Vector2D(10, 10);
      
      const mid = v1.lerp(v2, 0.5);
      expect(mid.x).toBe(5);
      expect(mid.y).toBe(5);
      
      const start = v1.lerp(v2, 0);
      expect(start).toEqual(v1);
      
      const end = v1.lerp(v2, 1);
      expect(end).toEqual(v2);
    });

    test('should clamp interpolation parameter', () => {
      const v1 = new Vector2D(0, 0);
      const v2 = new Vector2D(10, 10);
      
      const underflow = v1.lerp(v2, -1);
      expect(underflow).toEqual(v1);
      
      const overflow = v1.lerp(v2, 2);
      expect(overflow).toEqual(v2);
    });

    test('should check vector equality', () => {
      const v1 = new Vector2D(1, 2);
      const v2 = new Vector2D(1, 2);
      const v3 = new Vector2D(2, 1);
      
      expect(v1.equals(v2)).toBe(true);
      expect(v1.equals(v3)).toBe(false);
    });
  });
}); 