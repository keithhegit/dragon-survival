import { describe, test, expect, beforeEach, vi } from 'vitest';
import { LevelSystem, LevelEvent } from '../LevelSystem';

describe('LevelSystem', () => {
  let levelSystem: LevelSystem;

  beforeEach(() => {
    levelSystem = new LevelSystem();
  });

  test('should initialize at level 1', () => {
    expect(levelSystem.getCurrentLevel()).toBe(1);
    expect(levelSystem.getCurrentExp()).toBe(0);
  });

  test('should gain experience correctly', () => {
    levelSystem.addExperience(50);
    expect(levelSystem.getCurrentExp()).toBe(50);
  });

  test('should level up when enough exp gained', () => {
    levelSystem.addExperience(150);
    expect(levelSystem.getCurrentLevel()).toBe(2);
  });

  test('should accumulate skill and stat points on level up', () => {
    levelSystem.addExperience(150);
    expect(levelSystem.getUnspentSkillPoints()).toBe(1);
    expect(levelSystem.getUnspentStatPoints()).toBe(3);
  });

  test('should calculate exp progress correctly', () => {
    levelSystem.addExperience(50);
    expect(levelSystem.getExpProgress()).toBeCloseTo(0.5);
  });

  test('should emit levelUp event', () => {
    const listener = vi.fn<[LevelEvent], void>();
    levelSystem.on('levelUp', listener);
    
    levelSystem.addExperience(150);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      type: 'levelUp',
      data: expect.objectContaining({
        level: 2
      })
    }));
  });

  test('should emit expGain event', () => {
    const listener = vi.fn<[LevelEvent], void>();
    levelSystem.on('expGain', listener);
    
    levelSystem.addExperience(50);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      type: 'expGain',
      data: expect.objectContaining({
        gainedExp: 50
      })
    }));
  });
}); 