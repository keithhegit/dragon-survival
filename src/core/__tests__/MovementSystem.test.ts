import { describe, test, expect, beforeEach } from 'vitest';
import { MovementSystem, MovementState } from '../MovementSystem';
import { GridSystem } from '../GridSystem';
import { Vector2D } from '@/utils/Vector2D';

describe('MovementSystem', () => {
  let movementSystem: MovementSystem;
  let gridSystem: GridSystem;

  beforeEach(() => {
    gridSystem = new GridSystem(32); // 32px网格大小
    movementSystem = new MovementSystem(gridSystem);
  });

  describe('Basic Movement', () => {
    test('should move in cardinal directions', () => {
      const state: MovementState = {
        position: new Vector2D(0, 0),
        velocity: new Vector2D(5, 0), // 向右移动
        isMoving: true
      };

      const newState = movementSystem.update(state, 1);
      expect(newState.position.x).toBe(5);
      expect(newState.position.y).toBe(0);
    });

    test('should respect maximum speed', () => {
      const state: MovementState = {
        position: new Vector2D(0, 0),
        velocity: new Vector2D(20, 0), // 超过最大速度
        isMoving: true
      };

      const newState = movementSystem.update(state, 1);
      expect(newState.velocity.length()).toBeLessThanOrEqual(10); // maxSpeed = 10
    });
  });

  describe('Grid Snapping', () => {
    test('should not snap when moving', () => {
      const state: MovementState = {
        position: new Vector2D(30, 30),
        velocity: new Vector2D(5, 0),
        isMoving: true
      };

      const newState = movementSystem.update(state, 1);
      expect(newState.position.x).toBe(35);
      expect(newState.position.y).toBe(30);
    });

    test('should snap to grid when stopping near grid center', () => {
      const state: MovementState = {
        position: new Vector2D(34, 34), // 接近网格中心(32, 32)
        velocity: new Vector2D(),
        isMoving: false
      };

      const newState = movementSystem.update(state, 1);
      expect(newState.position.x).toBe(32);
      expect(newState.position.y).toBe(32);
    });

    test('should not snap when too far from grid center', () => {
      const state: MovementState = {
        position: new Vector2D(45, 45), // 远离网格中心
        velocity: new Vector2D(),
        isMoving: false
      };

      const newState = movementSystem.update(state, 1);
      expect(newState.position.x).toBe(45);
      expect(newState.position.y).toBe(45);
    });
  });

  describe('Collision Handling', () => {
    test('should stop at wall collision', () => {
      gridSystem.setCell(new Vector2D(2, 0), false); // 设置墙
      
      const state: MovementState = {
        position: new Vector2D(32, 0),
        velocity: new Vector2D(5, 0),
        isMoving: true
      };

      const newState = movementSystem.update(state, 1);
      expect(newState.position.x).toBe(32); // 应该停在原地
      expect(newState.velocity.x).toBe(0);
    });

    test('should slide along walls', () => {
      gridSystem.setCell(new Vector2D(1, 1), false); // 设置斜向墙
      
      const state: MovementState = {
        position: new Vector2D(0, 0),
        velocity: new Vector2D(5, 5), // 斜向移动
        isMoving: true
      };

      const newState = movementSystem.update(state, 1);
      expect(newState.velocity.length()).toBeGreaterThan(0); // 应该继续移动
      expect(newState.velocity.x === 0 || newState.velocity.y === 0).toBe(true); // 应该沿墙滑动
    });
  });

  describe('Diagonal Movement', () => {
    test('should normalize diagonal velocity', () => {
      const state: MovementState = {
        position: new Vector2D(0, 0),
        velocity: new Vector2D(5, 5),
        isMoving: true
      };

      const newState = movementSystem.update(state, 1);
      expect(newState.velocity.length()).toBe(5); // baseSpeed
      expect(Math.abs(newState.velocity.x)).toBeCloseTo(5 / Math.sqrt(2));
      expect(Math.abs(newState.velocity.y)).toBeCloseTo(5 / Math.sqrt(2));
    });
  });

  describe('Path Prediction', () => {
    test('should predict straight path', () => {
      const state: MovementState = {
        position: new Vector2D(0, 0),
        velocity: new Vector2D(5, 0),
        isMoving: true
      };

      const path = movementSystem.predictPath(state, 3);
      expect(path.length).toBe(4); // 初始位置 + 3步
      expect(path[1].x).toBe(5);
      expect(path[2].x).toBe(10);
    });

    test('should predict path with collision', () => {
      gridSystem.setCell(new Vector2D(2, 0), false); // 设置墙
      
      const state: MovementState = {
        position: new Vector2D(0, 0),
        velocity: new Vector2D(5, 0),
        isMoving: true
      };

      const path = movementSystem.predictPath(state, 10);
      const lastPosition = path[path.length - 1];
      expect(lastPosition.x).toBeLessThan(64); // 不应该穿过墙（2 * 32 = 64）
    });
  });
}); 