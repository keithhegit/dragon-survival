import { EventEmitter } from '../utils/EventEmitter';
import { LevelSystem } from './LevelSystem';

export type ExperienceEventType = 'expGain' | 'expLoss';

export interface ExperienceEvent {
  type: ExperienceEventType;
  data: {
    amount: number;
    currentExp: number;
    source?: string;
  };
}

export class ExperienceSystem extends EventEmitter<ExperienceEvent> {
  private currentExp: number = 0;
  private levelSystem: LevelSystem;

  constructor(levelSystem: LevelSystem) {
    super();
    this.levelSystem = levelSystem;
  }

  public gainExperience(amount: number, source?: string): void {
    if (amount <= 0) return;

    this.currentExp += amount;
    this.levelSystem.addExperience(amount);
    
    this.emit('expGain', {
      type: 'expGain',
      data: {
        amount,
        currentExp: this.currentExp,
        source
      }
    });
  }

  public loseExperience(amount: number, source?: string): void {
    if (amount <= 0) return;

    const actualLoss = Math.min(this.currentExp, amount);
    this.currentExp -= actualLoss;
    
    this.emit('expLoss', {
      type: 'expLoss',
      data: {
        amount: actualLoss,
        currentExp: this.currentExp,
        source
      }
    });
  }

  public getCurrentExp(): number {
    return this.currentExp;
  }

  public getExpToNextLevel(): number {
    return this.levelSystem.getExpToNextLevel();
  }

  public getExpProgress(): number {
    return this.levelSystem.getExpProgress();
  }
} 