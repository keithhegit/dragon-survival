import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ExperienceSystem } from '../ExperienceSystem';
import { LevelSystem } from '../LevelSystem';

describe('ExperienceSystem', () => {
  let experienceSystem: ExperienceSystem;
  let levelSystem: LevelSystem;
  let expGainSpy: any;
  let expLossSpy: any;

  beforeEach(() => {
    levelSystem = new LevelSystem();
    // Mock LevelSystem methods
    vi.spyOn(levelSystem, 'addExperience');
    vi.spyOn(levelSystem, 'getExpToNextLevel').mockReturnValue(100);
    vi.spyOn(levelSystem, 'getExpProgress').mockReturnValue(0.5);

    experienceSystem = new ExperienceSystem(levelSystem);
    expGainSpy = vi.fn();
    expLossSpy = vi.fn();
    
    experienceSystem.on('expGain', expGainSpy);
    experienceSystem.on('expLoss', expLossSpy);
  });

  describe('gainExperience', () => {
    test('should increase current experience', () => {
      experienceSystem.gainExperience(50);
      expect(experienceSystem.getCurrentExp()).toBe(50);
    });

    test('should call levelSystem.addExperience', () => {
      experienceSystem.gainExperience(50);
      expect(levelSystem.addExperience).toHaveBeenCalledWith(50);
    });

    test('should emit expGain event with correct data', () => {
      experienceSystem.gainExperience(50, 'test');
      expect(expGainSpy).toHaveBeenCalledWith({
        type: 'expGain',
        data: {
          amount: 50,
          currentExp: 50,
          source: 'test'
        }
      });
    });

    test('should not process negative experience gain', () => {
      experienceSystem.gainExperience(-50);
      expect(experienceSystem.getCurrentExp()).toBe(0);
      expect(expGainSpy).not.toHaveBeenCalled();
    });
  });

  describe('loseExperience', () => {
    beforeEach(() => {
      experienceSystem.gainExperience(100); // Set initial exp
    });

    test('should decrease current experience', () => {
      experienceSystem.loseExperience(50);
      expect(experienceSystem.getCurrentExp()).toBe(50);
    });

    test('should not reduce experience below zero', () => {
      experienceSystem.loseExperience(150);
      expect(experienceSystem.getCurrentExp()).toBe(0);
    });

    test('should emit expLoss event with correct data', () => {
      experienceSystem.loseExperience(50, 'test');
      expect(expLossSpy).toHaveBeenCalledWith({
        type: 'expLoss',
        data: {
          amount: 50,
          currentExp: 50,
          source: 'test'
        }
      });
    });

    test('should not process negative experience loss', () => {
      experienceSystem.loseExperience(-50);
      expect(experienceSystem.getCurrentExp()).toBe(100);
      expect(expLossSpy).not.toHaveBeenCalled();
    });
  });

  describe('getters', () => {
    test('getCurrentExp should return current experience', () => {
      experienceSystem.gainExperience(50);
      expect(experienceSystem.getCurrentExp()).toBe(50);
    });

    test('getExpToNextLevel should return value from levelSystem', () => {
      expect(experienceSystem.getExpToNextLevel()).toBe(100);
      expect(levelSystem.getExpToNextLevel).toHaveBeenCalled();
    });

    test('getExpProgress should return value from levelSystem', () => {
      expect(experienceSystem.getExpProgress()).toBe(0.5);
      expect(levelSystem.getExpProgress).toHaveBeenCalled();
    });
  });

  describe('integration with LevelSystem', () => {
    test('should properly integrate with LevelSystem for experience gain', () => {
      const gainAmount = 50;
      experienceSystem.gainExperience(gainAmount);
      
      expect(levelSystem.addExperience).toHaveBeenCalledWith(gainAmount);
      expect(experienceSystem.getCurrentExp()).toBe(gainAmount);
    });

    test('should handle multiple experience gains', () => {
      experienceSystem.gainExperience(30);
      experienceSystem.gainExperience(20);
      
      expect(levelSystem.addExperience).toHaveBeenCalledTimes(2);
      expect(experienceSystem.getCurrentExp()).toBe(50);
    });
  });
}); 