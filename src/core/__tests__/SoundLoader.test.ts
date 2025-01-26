import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { SoundLoader } from '../SoundLoader';

describe('SoundLoader', () => {
  let soundLoader: SoundLoader;

  beforeEach(() => {
    soundLoader = SoundLoader.getInstance();
  });

  afterEach(() => {
    soundLoader.cleanup();
  });

  test('should load sounds successfully', async () => {
    await soundLoader.loadSounds();
    expect(() => soundLoader.playSound('movement', 'walk')).not.toThrow();
  });

  test('should handle invalid sound keys', () => {
    const consoleSpy = vi.spyOn(console, 'warn');
    soundLoader.playSound('movement', 'invalid' as MovementSoundKey);
    expect(consoleSpy).toHaveBeenCalled();
  });

  test('should control master volume', async () => {
    await soundLoader.loadSounds();
    soundLoader.setMasterVolume(0.5);
    const testSound = soundLoader['sounds'].values().next().value;
    expect(testSound.volume).toBe(0.5);
  });
}); 