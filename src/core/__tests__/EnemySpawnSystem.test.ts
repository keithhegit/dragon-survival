import { describe, test, expect, beforeEach } from 'vitest';
import { EnemySpawnSystem, SpawnState } from '../EnemySpawnSystem';
import { Vector2D } from '@/utils/Vector2D';

describe('EnemySpawnSystem', () => {
  let spawnSystem: EnemySpawnSystem;
  let spawnState: SpawnState;
  let playerPosition: Vector2D;

  beforeEach(() => {
    spawnSystem = new EnemySpawnSystem(32);
    spawnState = {
      waveNumber: 1,
      enemyCount: 0,
      spawnInterval: 1000,
      lastSpawnTime: 0,
      spawnRadius: 400
    };
    playerPosition = new Vector2D(0, 0);
  });

  test('should spawn enemy when conditions are met', () => {
    const enemy = spawnSystem.update(spawnState, playerPosition);
    expect(enemy).not.toBeNull();
    expect(enemy?.type).toBe('basic');
  });

  test('should respect spawn interval', () => {
    spawnState.lastSpawnTime = Date.now();
    const enemy = spawnSystem.update(spawnState, playerPosition);
    expect(enemy).toBeNull();
  });

  test('should limit enemy count', () => {
    spawnState.enemyCount = 100;
    const enemy = spawnSystem.update(spawnState, playerPosition);
    expect(enemy).toBeNull();
  });

  test('should scale enemy stats with wave number', () => {
    spawnState.waveNumber = 2;
    const enemy = spawnSystem.update(spawnState, playerPosition);
    expect(enemy?.health).toBeGreaterThan(EnemySpawnSystem['BASE_ENEMIES'][0].health);
  });
}); 