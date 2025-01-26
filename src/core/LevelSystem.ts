import { EventEmitter } from '../utils/EventEmitter';
import { GameSystem } from './interfaces/GameSystem';

export interface LevelConfig {
  level: number;
  expRequired: number;
  rewards: {
    skillPoints: number;
    statPoints: number;
    unlocks?: string[];
  };
}

export type LevelEventType = 'levelUp' | 'expGain';

export interface LevelEvent {
  type: LevelEventType;
  data: {
    level?: number;
    currentExp?: number;
    gainedExp?: number;
    rewards?: LevelConfig['rewards'];
  };
}

export class LevelSystem extends EventEmitter<LevelEvent> implements GameSystem {
  private static readonly LEVEL_CONFIGS: LevelConfig[] = [
    {
      level: 1,
      expRequired: 100,
      rewards: {
        skillPoints: 1,
        statPoints: 3
      }
    },
    {
      level: 2,
      expRequired: 250,
      rewards: {
        skillPoints: 1,
        statPoints: 3,
        unlocks: ['basicSkill']
      }
    }
    // ... 更多等级配置
  ];

  private static readonly MAX_LEVEL = 60;

  private currentExp: number = 0;
  private currentLevel: number = 1;
  private unspentSkillPoints: number = 0;
  private unspentStatPoints: number = 0;

  constructor() {
    super();
  }

  public getCurrentLevel(): number {
    return this.currentLevel;
  }

  public getCurrentLevelConfig(): LevelConfig {
    return LevelSystem.LEVEL_CONFIGS[this.currentLevel - 1];
  }

  public addExperience(amount: number): void {
    if (amount <= 0) return;

    this.currentExp += amount;
    this.emit('expGain', {
      type: 'expGain',
      data: {
        currentExp: this.currentExp,
        gainedExp: amount
      }
    });

    this.checkLevelUp();
  }

  private checkLevelUp(): void {
    const nextLevel = this.getNextLevel();
    if (!nextLevel || this.currentLevel >= LevelSystem.MAX_LEVEL) return;

    while (this.currentExp >= nextLevel.expRequired) {
      this.levelUp(nextLevel);
      const newNextLevel = this.getNextLevel();
      if (!newNextLevel || this.currentLevel >= LevelSystem.MAX_LEVEL) break;
    }
  }

  private levelUp(nextLevel: LevelConfig): void {
    this.currentLevel = nextLevel.level;
    this.unspentSkillPoints += nextLevel.rewards.skillPoints;
    this.unspentStatPoints += nextLevel.rewards.statPoints;
    
    this.emit('levelUp', {
      type: 'levelUp',
      data: {
        level: this.currentLevel,
        rewards: nextLevel.rewards
      }
    });
  }

  private getNextLevel(): LevelConfig | null {
    const nextLevelIndex = this.currentLevel;
    return LevelSystem.LEVEL_CONFIGS[nextLevelIndex] || null;
  }

  public getExpProgress(): number {
    if (this.isMaxLevel()) return 1;

    const currentLevelConfig = LevelSystem.LEVEL_CONFIGS[this.currentLevel - 1];
    const nextLevelConfig = this.getNextLevel();
    
    if (!nextLevelConfig) return 1;
    
    const expInCurrentLevel = this.currentExp - currentLevelConfig.expRequired;
    const expNeededForNextLevel = nextLevelConfig.expRequired - currentLevelConfig.expRequired;
    
    return Math.min(1, Math.max(0, expInCurrentLevel / expNeededForNextLevel));
  }

  public getUnspentSkillPoints(): number {
    return this.unspentSkillPoints;
  }

  public getUnspentStatPoints(): number {
    return this.unspentStatPoints;
  }

  public useSkillPoint(): boolean {
    if (this.unspentSkillPoints <= 0) return false;
    this.unspentSkillPoints--;
    return true;
  }

  public useStatPoint(): boolean {
    if (this.unspentStatPoints <= 0) return false;
    this.unspentStatPoints--;
    return true;
  }

  public getExpToNextLevel(): number {
    const nextLevel = this.getNextLevel();
    if (!nextLevel) return 0;
    
    const currentLevelConfig = this.getCurrentLevelConfig();
    return nextLevel.expRequired - currentLevelConfig.expRequired;
  }

  public isMaxLevel(): boolean {
    return this.currentLevel >= LevelSystem.MAX_LEVEL;
  }

  public getMaxLevel(): number {
    return LevelSystem.MAX_LEVEL;
  }

  public update(deltaTime: number): void {
    // LevelSystem 是被动系统，不需要主动更新
  }
} 