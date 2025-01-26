import { describe, test, expect, beforeEach, vi } from 'vitest';
import { CombatSystem, Target, CombatState, CombatEvent } from '../CombatSystem';
import { Vector2D } from '@/utils/Vector2D';

describe('CombatSystem', () => {
  let combatSystem: CombatSystem;
  let mockTarget: Target;
  let combatState: CombatState;

  beforeEach(() => {
    combatSystem = new CombatSystem(32);
    
    mockTarget = {
      id: '1',
      position: new Vector2D(50, 50),
      health: 100,
      maxHealth: 100,
      takeDamage: vi.fn()
    };

    combatState = {
      position: new Vector2D(0, 0),
      attackRange: 100,
      attackDamage: 10,
      attackCooldown: 1000,
      lastAttackTime: 0
    };

    combatSystem.clearTargets();
  });

  test('should attack target within range', () => {
    combatSystem.addTarget(mockTarget);
    combatSystem.update(combatState);
    
    expect(mockTarget.takeDamage).toHaveBeenCalledWith(combatState.attackDamage);
  });

  test('should not attack target outside range', () => {
    mockTarget.position = new Vector2D(200, 200);
    combatSystem.addTarget(mockTarget);
    combatSystem.update(combatState);
    
    expect(mockTarget.takeDamage).not.toHaveBeenCalled();
  });

  test('should respect attack cooldown', () => {
    combatSystem.addTarget(mockTarget);
    
    // 第一次攻击
    combatSystem.update(combatState);
    expect(mockTarget.takeDamage).toHaveBeenCalledTimes(1);
    
    // 立即再次攻击（应该被冷却限制）
    combatSystem.update(combatState);
    expect(mockTarget.takeDamage).toHaveBeenCalledTimes(1);
  });

  test('should attack nearest target when multiple in range', () => {
    const nearTarget: Target = {
      id: '2',
      position: new Vector2D(30, 30),
      health: 100,
      maxHealth: 100,
      takeDamage: vi.fn()
    };

    combatSystem.addTarget(mockTarget);
    combatSystem.addTarget(nearTarget);
    combatSystem.update(combatState);
    
    expect(nearTarget.takeDamage).toHaveBeenCalled();
    expect(mockTarget.takeDamage).not.toHaveBeenCalled();
  });

  describe('Target State Management', () => {
    test('should remove dead target', () => {
      mockTarget.health = 5; // 低血量
      combatSystem.addTarget(mockTarget);
      combatState.attackDamage = 10; // 致命伤害
      
      combatSystem.update(combatState);
      expect(combatSystem['targets'].size).toBe(0);
    });

    test('should not remove target if health > 0', () => {
      mockTarget.health = 20;
      combatSystem.addTarget(mockTarget);
      combatState.attackDamage = 10;
      
      combatSystem.update(combatState);
      expect(combatSystem['targets'].size).toBe(1);
    });
  });

  describe('Combat Events', () => {
    test('should emit attack event', () => {
      const attackListener = vi.fn();
      combatSystem.addEventListener('attack', attackListener);
      
      combatSystem.addTarget(mockTarget);
      combatSystem.update(combatState);

      expect(attackListener).toHaveBeenCalledWith(expect.objectContaining({
        type: 'attack',
        target: mockTarget,
        damage: combatState.attackDamage
      }));
    });

    test('should emit targetDeath event when target dies', () => {
      const deathListener = vi.fn();
      combatSystem.addEventListener('targetDeath', deathListener);
      
      mockTarget.health = 5;
      combatSystem.addTarget(mockTarget);
      combatState.attackDamage = 10;
      
      combatSystem.update(combatState);

      expect(deathListener).toHaveBeenCalledWith(expect.objectContaining({
        type: 'targetDeath',
        target: mockTarget
      }));
    });

    test('should not emit targetDeath event if target survives', () => {
      const deathListener = vi.fn();
      combatSystem.addEventListener('targetDeath', deathListener);
      
      mockTarget.health = 20;
      combatSystem.addTarget(mockTarget);
      combatState.attackDamage = 10;
      
      combatSystem.update(combatState);
      
      expect(deathListener).not.toHaveBeenCalled();
    });

    test('should properly remove event listeners', () => {
      const listener = vi.fn();
      combatSystem.addEventListener('attack', listener);
      combatSystem.removeEventListener('attack', listener);
      
      combatSystem.addTarget(mockTarget);
      combatSystem.update(combatState);
      
      expect(listener).not.toHaveBeenCalled();
    });
  });
}); 