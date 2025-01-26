import { describe, test, expect } from 'vitest';
import { StatCalculator } from '../StatCalculator';
import { CharacterStats } from '../StatSystem';

describe('StatCalculator', () => {
  const defaultAttackerStats: CharacterStats = {
    health: 100,
    damage: 10,
    speed: 3,
    defense: 5,
    critChance: 0.5, // 50%暴击率用于测试
    critDamage: 2.0
  };

  const defaultDefenderStats: CharacterStats = {
    health: 100,
    damage: 5,
    speed: 3,
    defense: 20,
    critChance: 0.05,
    critDamage: 1.5
  };

  test('should calculate base damage correctly', () => {
    const result = StatCalculator.calculateDamage(
      { ...defaultAttackerStats, critChance: 0 }, // 禁用暴击以测试基础伤害
      defaultDefenderStats,
      20
    );

    // 基础伤害20 + 攻击力10 = 30
    // 20点防御约等于16.7%减伤
    // 30 * (1 - 0.167) ≈ 25
    expect(result.finalDamage).toBeCloseTo(25, 0);
    expect(result.isCritical).toBe(false);
  });

  test('should apply critical damage correctly', () => {
    const result = StatCalculator.calculateDamage(
      { ...defaultAttackerStats, critChance: 1 }, // 100%暴击
      defaultDefenderStats,
      20
    );

    // (基础伤害20 + 攻击力10) * 2.0暴伤 = 60
    // 60 * (1 - 0.167) ≈ 50
    expect(result.finalDamage).toBeCloseTo(50, 0);
    expect(result.isCritical).toBe(true);
  });

  test('should calculate healing correctly', () => {
    const healing = StatCalculator.calculateHealing(
      { ...defaultAttackerStats, health: 200 },
      50
    );

    // 基础治疗50 * (1 + 200/1000) = 60
    expect(healing).toBeCloseTo(60, 0);
  });

  test('should calculate move speed with cap', () => {
    const speed = StatCalculator.calculateMoveSpeed({
      ...defaultAttackerStats,
      speed: 15 // 超过上限
    });

    expect(speed).toBe(10); // 应该被限制在10
  });
}); 