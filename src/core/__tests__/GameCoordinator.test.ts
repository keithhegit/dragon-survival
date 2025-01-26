import { describe, test, expect, beforeEach, vi } from 'vitest';
import { GameCoordinator } from '../GameCoordinator';
import { MovementSystem } from '../MovementSystem';
import { CombatSystem } from '../CombatSystem';
import { WaveSystem } from '../WaveSystem';
import { EnemySpawnSystem } from '../EnemySpawnSystem';

describe('GameCoordinator', () => {
  let coordinator: GameCoordinator;

  beforeEach(() => {
    coordinator = new GameCoordinator();
  });

  test('should update all systems', () => {
    const deltaTime = 16; // ~60fps
    
    // Mock all system updates
    vi.spyOn(MovementSystem.prototype, 'update');
    vi.spyOn(CombatSystem.prototype, 'update');
    vi.spyOn(EnemySpawnSystem.prototype, 'update');
    
    coordinator.update(deltaTime);
    
    expect(MovementSystem.prototype.update).toHaveBeenCalledWith(deltaTime);
    expect(CombatSystem.prototype.update).toHaveBeenCalledWith(deltaTime);
    expect(EnemySpawnSystem.prototype.update).toHaveBeenCalled();
  });

  test('should handle wave transitions', () => {
    const onEnemyDeath = vi.fn();
    const resetForNewWave = vi.fn();
    
    vi.spyOn(WaveSystem.prototype, 'onEnemyDeath').mockImplementation(onEnemyDeath);
    vi.spyOn(EnemySpawnSystem.prototype, 'resetForNewWave').mockImplementation(resetForNewWave);
    
    // 触发事件
    coordinator['combatSystem'].emit('targetDeath', { id: '1' });
    expect(onEnemyDeath).toHaveBeenCalledWith('1');
    
    coordinator['waveSystem'].emit('waveStart', { wave: {} });
    expect(resetForNewWave).toHaveBeenCalled();
  });
}); 