import { describe, test, expect, beforeEach, vi } from 'vitest';
import { WaveSystem, WaveState, WaveEventType } from '../WaveSystem';

describe('WaveSystem', () => {
  let waveSystem: WaveSystem;

  beforeEach(() => {
    waveSystem = new WaveSystem();
  });

  test('should handle wave transitions', () => {
    const wave1Duration = WaveSystem.WAVE_CONFIGS[0].duration;
    expect(waveSystem.getCurrentWave(0).waveNumber).toBe(1);
    expect(waveSystem.getCurrentWave(wave1Duration + 1).waveNumber).toBe(2);
  });

  test('should calculate wave progress correctly', () => {
    waveSystem.startWave();
    const wave1 = WaveSystem.WAVE_CONFIGS[0];
    const halfTime = Date.now() + wave1.duration / 2;
    expect(waveSystem.getWaveProgress(halfTime)).toBeCloseTo(0.5);
  });

  test('should emit wave events', () => {
    const listener = vi.fn();
    waveSystem.addEventListener('waveStart', listener);
    
    waveSystem.startWave();
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      type: 'waveStart',
      wave: expect.any(Object)
    }));
  });

  test('should manage wave states correctly', () => {
    expect(waveSystem.getWaveState()).toBe(WaveState.PREPARING);
    waveSystem.startWave();
    expect(waveSystem.getWaveState()).toBe(WaveState.SPAWNING);
  });
}); 