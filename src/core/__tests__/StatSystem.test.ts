import { describe, test, expect, beforeEach, vi } from 'vitest';
import { StatSystem, StatEvent } from '../StatSystem';

describe('StatSystem', () => {
  let statSystem: StatSystem;

  beforeEach(() => {
    statSystem = new StatSystem();
  });

  test('should initialize with correct base stats', () => {
    const stats = statSystem.getEffectiveStats();
    expect(stats.health).toBe(100);
    expect(stats.damage).toBe(10);
    expect(stats.speed).toBe(3);
  });

  test('should add stat points correctly', () => {
    const success = statSystem.addStatPoint('health', 1);
    expect(success).toBe(true);
    
    const stats = statSystem.getEffectiveStats();
    expect(stats.health).toBe(110); // 基础100 + 加成10
  });

  test('should not exceed max stats', () => {
    // 尝试添加过多点数
    for (let i = 0; i < 1000; i++) {
      statSystem.addStatPoint('health', 1);
    }
    
    const stats = statSystem.getEffectiveStats();
    expect(stats.health).toBeLessThanOrEqual(1000); // 最大值1000
  });

  test('should emit stat increase event', () => {
    const listener = vi.fn<[StatEvent], void>();
    statSystem.on('statIncrease', listener);
    
    statSystem.addStatPoint('damage', 1);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      type: 'statIncrease',
      data: expect.objectContaining({
        stat: 'damage'
      })
    }));
  });

  test('should calculate stat progress correctly', () => {
    statSystem.addStatPoint('health', 5); // 增加50点生命值
    const progress = statSystem.getStatProgress('health');
    expect(progress).toBeCloseTo(0.15); // (100 + 50) / 1000
  });

  test('should reset stats correctly', () => {
    statSystem.addStatPoint('health', 1);
    statSystem.addStatPoint('damage', 1);
    
    statSystem.resetStats();
    const stats = statSystem.getEffectiveStats();
    
    expect(stats.health).toBe(100);
    expect(stats.damage).toBe(10);
  });
}); 