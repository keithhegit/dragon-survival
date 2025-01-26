import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BurningEffect, KnockbackEffect, DefenseBuffEffect } from '../skills/SkillEffects';
import { SkillTarget } from '../SkillEffect';

describe('SkillEffects', () => {
  let mockTarget: SkillTarget;

  beforeEach(() => {
    mockTarget = {
      stats: {
        health: 100,
        damage: 10,
        speed: 3,
        defense: 5,
        critChance: 0.05,
        critDamage: 1.5
      },
      position: { x: 100, y: 100 },
      source: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      takeDamage: vi.fn()
    };
  });

  describe('BurningEffect', () => {
    test('should deal percentage damage over time', () => {
      const effect = new BurningEffect();
      effect.onTick(mockTarget);
      
      expect(mockTarget.takeDamage).toHaveBeenCalledWith(5); // 5% of 100 health
    });

    test('should stack damage correctly', () => {
      const effect = new BurningEffect();
      effect.stacks = 2;
      effect.onTick(mockTarget);
      
      expect(mockTarget.takeDamage).toHaveBeenCalledWith(10); // 2 stacks * 5%
    });
  });

  describe('KnockbackEffect', () => {
    test('should apply knockback force', () => {
      const effect = new KnockbackEffect('test', '测试', '测试描述', 100);
      effect.onApply(mockTarget);
      
      expect(mockTarget.velocity.x).toBe(100); // 向右推
      expect(mockTarget.velocity.y).toBe(100); // 向上推
    });
  });

  describe('DefenseBuffEffect', () => {
    test('should increase defense', () => {
      const effect = new DefenseBuffEffect();
      const modifiedStats = effect.modifyStats(mockTarget.stats);
      
      expect(modifiedStats.defense).toBe(25); // 5 + 20
    });

    test('should cap damage reduction', () => {
      const effect = new DefenseBuffEffect();
      const damageResult = effect.modifyDamage({
        finalDamage: 100,
        isCritical: false,
        damageReduction: 0.7
      });
      
      expect(damageResult.damageReduction).toBe(0.75); // Capped at 75%
    });
  });
}); 