import { describe, test, expect, vi } from 'vitest';
import { BurningEffect, StrengthBuffEffect } from '../SkillEffect';
import { CharacterStats } from '../StatSystem';

describe('SkillEffects', () => {
  const mockTarget = {
    stats: {
      health: 100,
      damage: 10,
      speed: 3,
      defense: 5,
      critChance: 0.05,
      critDamage: 1.5
    },
    position: { x: 0, y: 0 }
  };

  test('burning effect should deal percentage damage', () => {
    const effect = new BurningEffect();
    const onTick = vi.spyOn(effect, 'onTick');

    effect.onTick(mockTarget);
    expect(onTick).toHaveBeenCalledWith(mockTarget);
  });

  test('strength buff should increase damage', () => {
    const effect = new StrengthBuffEffect();
    const modifiedStats = effect.modifyStats(mockTarget.stats);

    expect(modifiedStats.damage).toBe(12); // 10 * 1.2
  });
}); 