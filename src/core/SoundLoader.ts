import { MovementSounds, UISounds, MovementSoundKey, UISoundKey } from '@/assets/sounds';

export type SoundType = 'movement' | 'ui';

interface SoundOptions {
  volume?: number;
  loop?: boolean;
}

export class SoundLoader {
  private static instance: SoundLoader;
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private currentBGM?: HTMLAudioElement;

  private constructor() {}

  public static getInstance(): SoundLoader {
    if (!SoundLoader.instance) {
      SoundLoader.instance = new SoundLoader();
    }
    return SoundLoader.instance;
  }

  public async loadSounds(): Promise<void> {
    // 加载移动音效
    for (const [key, url] of Object.entries(MovementSounds)) {
      const audio = new Audio(url);
      this.sounds.set(`movement_${key}`, audio);
    }

    // 加载UI音效
    for (const [key, url] of Object.entries(UISounds)) {
      const audio = new Audio(url);
      this.sounds.set(`ui_${key}`, audio);
    }
  }

  public playSound(type: 'movement', key: MovementSoundKey, options?: SoundOptions): void;
  public playSound(type: 'ui', key: UISoundKey, options?: SoundOptions): void;
  public playSound(type: SoundType, key: string, options: SoundOptions = {}): void {
    const sound = this.sounds.get(`${type}_${key}`);
    if (!sound) {
      console.warn(`Sound not found: ${type}_${key}`);
      return;
    }

    // 克隆音频元素以支持重叠播放
    const audioClone = sound.cloneNode() as HTMLAudioElement;
    audioClone.volume = options.volume ?? 1;
    audioClone.loop = options.loop ?? false;

    // 播放完成后清理克隆的元素
    audioClone.addEventListener('ended', () => {
      audioClone.remove();
    });

    audioClone.play().catch(error => {
      console.warn('Failed to play sound:', error);
    });
  }

  public stopAllSounds(): void {
    this.sounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  public setMasterVolume(volume: number): void {
    this.sounds.forEach(sound => {
      sound.volume = Math.max(0, Math.min(1, volume));
    });
  }

  public cleanup(): void {
    this.stopAllSounds();
    this.sounds.clear();
  }
} 