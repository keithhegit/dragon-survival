export enum SoundType {
  // UI音效
  UI_CLICK = 'ui_click',
  UI_HOVER = 'ui_hover',
  UI_LEVEL_UP = 'ui_level_up',

  // 战斗音效
  SKILL_BASIC_BREATH = 'skill_basic_breath',
  SKILL_SPREAD_BREATH = 'skill_spread_breath',
  SKILL_ELEMENTAL_BREATH = 'skill_elemental_breath',
  SKILL_WING_SLASH = 'skill_wing_slash',
  SKILL_WHIRLWIND = 'skill_whirlwind',
  
  // 效果音效
  EFFECT_BURNING = 'effect_burning',
  EFFECT_KNOCKBACK = 'effect_knockback',
  EFFECT_DEFENSE_BUFF = 'effect_defense_buff',
  
  // 环境音效
  AMBIENT_BATTLE = 'ambient_battle',
  AMBIENT_VICTORY = 'ambient_victory',
  AMBIENT_DEFEAT = 'ambient_defeat'
}

export const SOUND_PATHS: Record<SoundType, string> = {
  [SoundType.UI_CLICK]: 'ui/click.mp3',
  [SoundType.UI_HOVER]: 'ui/hover.mp3',
  [SoundType.UI_LEVEL_UP]: 'ui/level_up.mp3',

  [SoundType.SKILL_BASIC_BREATH]: 'skills/basic_breath.mp3',
  [SoundType.SKILL_SPREAD_BREATH]: 'skills/spread_breath.mp3',
  [SoundType.SKILL_ELEMENTAL_BREATH]: 'skills/elemental_breath.mp3',
  [SoundType.SKILL_WING_SLASH]: 'skills/wing_slash.mp3',
  [SoundType.SKILL_WHIRLWIND]: 'skills/whirlwind.mp3',

  [SoundType.EFFECT_BURNING]: 'effects/burning.mp3',
  [SoundType.EFFECT_KNOCKBACK]: 'effects/knockback.mp3',
  [SoundType.EFFECT_DEFENSE_BUFF]: 'effects/defense_buff.mp3',

  [SoundType.AMBIENT_BATTLE]: 'ambient/battle.mp3',
  [SoundType.AMBIENT_VICTORY]: 'ambient/victory.mp3',
  [SoundType.AMBIENT_DEFEAT]: 'ambient/defeat.mp3'
};

export class SoundSystem {
  private static instance: SoundSystem;
  private audioElements: Map<SoundType, HTMLAudioElement> = new Map();
  private volume: number = 1.0;
  private muted: boolean = false;

  private constructor() {
    this.preloadSounds();
  }

  public static getInstance(): SoundSystem {
    if (!SoundSystem.instance) {
      SoundSystem.instance = new SoundSystem();
    }
    return SoundSystem.instance;
  }

  private preloadSounds(): void {
    Object.entries(SOUND_PATHS).forEach(([type, path]) => {
      const audio = new Audio(`/assets/sounds/${path}`);
      audio.preload = 'auto';
      this.audioElements.set(type as SoundType, audio);
    });
  }

  public play(type: SoundType): void {
    if (this.muted) return;
    
    const audio = this.audioElements.get(type);
    if (audio) {
      audio.volume = this.volume;
      audio.currentTime = 0;
      audio.play().catch(console.error);
    }
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audioElements.forEach(audio => {
      audio.volume = this.volume;
    });
  }

  public toggleMute(): void {
    this.muted = !this.muted;
    this.audioElements.forEach(audio => {
      audio.muted = this.muted;
    });
  }

  public stopAll(): void {
    this.audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }
} 