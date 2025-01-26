import { describe, test, expect, vi, beforeEach } from 'vitest';
import { CooldownSystem } from '../CooldownSystem';

describe('CooldownSystem', () => {
  let cooldownSystem: CooldownSystem;
  const mockSkillId = 'testSkill';
  const mockDuration = 1000;

  beforeEach(() => {
    cooldownSystem = new CooldownSystem();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should start cooldown correctly', () => {
    const listener = vi.fn();
    cooldownSystem.on('start', listener);

    cooldownSystem.startCooldown(mockSkillId, mockDuration);
    
    expect(cooldownSystem.isOnCooldown(mockSkillId)).toBe(true);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      type: 'start',
      data: expect.objectContaining({
        skillId: mockSkillId,
        remainingTime: mockDuration
      })
    }));
  });

  test('should track remaining time correctly', () => {
    cooldownSystem.startCooldown(mockSkillId, mockDuration);
    
    vi.advanceTimersByTime(500);
    expect(cooldownSystem.getRemainingTime(mockSkillId)).toBe(500);
    
    vi.advanceTimersByTime(500);
    expect(cooldownSystem.getRemainingTime(mockSkillId)).toBe(0);
  });

  test('should calculate progress correctly', () => {
    cooldownSystem.startCooldown(mockSkillId, mockDuration);
    
    vi.advanceTimersByTime(500);
    expect(cooldownSystem.getCooldownProgress(mockSkillId)).toBe(0.5);
    
    vi.advanceTimersByTime(500);
    expect(cooldownSystem.getCooldownProgress(mockSkillId)).toBe(1);
  });

  test('should emit events during update', () => {
    const updateListener = vi.fn();
    const endListener = vi.fn();
    
    cooldownSystem.on('update', updateListener);
    cooldownSystem.on('end', endListener);
    
    cooldownSystem.startCooldown(mockSkillId, mockDuration);
    
    vi.advanceTimersByTime(500);
    cooldownSystem.update();
    expect(updateListener).toHaveBeenCalled();
    
    vi.advanceTimersByTime(500);
    cooldownSystem.update();
    expect(endListener).toHaveBeenCalled();
  });
}); 