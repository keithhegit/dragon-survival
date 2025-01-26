import { describe, test, expect, beforeEach, vi } from 'vitest';
import { ExperienceSourceManager, ExperienceSourceType, EXPERIENCE_SOURCES } from '../ExperienceSource';

describe('ExperienceSourceManager', () => {
  let sourceManager: ExperienceSourceManager;

  beforeEach(() => {
    sourceManager = new ExperienceSourceManager();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should calculate base experience correctly', () => {
    const exp = sourceManager.calculateExperience('kill_normal', 1);
    expect(exp).toBe(10);
  });

  test('should apply level scaling to kill experience', () => {
    const exp = sourceManager.calculateExperience('kill_normal', 20);
    expect(exp).toBe(8); // 10 * (1 - 0.2)
  });

  test('should respect cooldowns', () => {
    expect(sourceManager.canGainExperience('kill_boss', 1)).toBe(true);
    
    sourceManager.recordExperienceGain('kill_boss');
    expect(sourceManager.canGainExperience('kill_boss', 1)).toBe(false);
    
    vi.advanceTimersByTime(3600000);
    expect(sourceManager.canGainExperience('kill_boss', 1)).toBe(true);
  });

  test('should respect daily limits', () => {
    const questId = 'quest_daily';
    const maxTimes = EXPERIENCE_SOURCES[questId].maxTimesPerDay!;

    for (let i = 0; i < maxTimes; i++) {
      expect(sourceManager.canGainExperience(questId, 1)).toBe(true);
      sourceManager.recordExperienceGain(questId);
    }

    expect(sourceManager.canGainExperience(questId, 1)).toBe(false);
    
    // 第二天应该重置
    vi.advanceTimersByTime(24 * 60 * 60 * 1000);
    expect(sourceManager.canGainExperience(questId, 1)).toBe(true);
  });

  test('should check level requirements', () => {
    expect(sourceManager.canGainExperience('explore_newarea', 1)).toBe(false);
    expect(sourceManager.canGainExperience('explore_newarea', 5)).toBe(true);
  });
}); 