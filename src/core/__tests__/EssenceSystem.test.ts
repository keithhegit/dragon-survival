import { describe, test, expect, vi, beforeEach } from 'vitest';
import { EssenceSystem, EssenceType, ESSENCE_CONFIG } from '../EssenceSystem';

describe('EssenceSystem', () => {
  let essenceSystem: EssenceSystem;

  beforeEach(() => {
    essenceSystem = new EssenceSystem();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should spawn essence with correct properties', () => {
    const spawnListener = vi.fn();
    essenceSystem.on('spawn', spawnListener);

    const position = { x: 100, y: 100 };
    essenceSystem.spawnEssence(EssenceType.SMALL, position);

    expect(spawnListener).toHaveBeenCalled();
    const essence = spawnListener.mock.calls[0][0].data.essence;
    
    expect(essence).toMatchObject({
      type: EssenceType.SMALL,
      collected: false
    });
    expect(essence.position.x).toBeCloseTo(position.x, -1); // 允许随机偏移
    expect(essence.position.y).toBeCloseTo(position.y, -1);
  });

  test('should collect essence within range', () => {
    const collectListener = vi.fn();
    essenceSystem.on('collect', collectListener);

    const position = { x: 100, y: 100 };
    essenceSystem.spawnEssence(EssenceType.SMALL, position);
    
    const essence = collectListener.mock.calls[0][0].data.essence;
    const expGained = essenceSystem.collectEssence(
      essence.id,
      { x: 100, y: 100 }
    );

    expect(expGained).toBe(ESSENCE_CONFIG[EssenceType.SMALL].baseExp);
    expect(collectListener).toHaveBeenCalled();
  });

  test('should not collect essence out of range', () => {
    const position = { x: 100, y: 100 };
    essenceSystem.spawnEssence(EssenceType.SMALL, position);
    
    const essences = essenceSystem.getEssencesInRange(position, 50);
    const expGained = essenceSystem.collectEssence(
      essences[0].id,
      { x: 200, y: 200 } // 远离精华的位置
    );

    expect(expGained).toBe(0);
  });

  test('should expire essence after duration', () => {
    const expireListener = vi.fn();
    essenceSystem.on('expire', expireListener);

    const position = { x: 100, y: 100 };
    essenceSystem.spawnEssence(EssenceType.SMALL, position);
    
    vi.advanceTimersByTime(ESSENCE_CONFIG[EssenceType.SMALL].duration + 100);
    
    expect(expireListener).toHaveBeenCalled();
    expect(essenceSystem.getEssencesInRange(position, 100)).toHaveLength(0);
  });

  test('should get essences in range correctly', () => {
    const position = { x: 100, y: 100 };
    essenceSystem.spawnEssence(EssenceType.SMALL, position);
    essenceSystem.spawnEssence(EssenceType.MEDIUM, { x: 200, y: 200 });

    const nearbyEssences = essenceSystem.getEssencesInRange(position, 50);
    expect(nearbyEssences.length).toBe(1);
    expect(nearbyEssences[0].type).toBe(EssenceType.SMALL);
  });
}); 