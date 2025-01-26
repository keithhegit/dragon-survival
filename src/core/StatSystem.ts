import { EventEmitter } from '@/utils/EventEmitter';
import { StatCalculator } from './StatCalculator';
import { DamageResult } from './StatCalculator';

export interface CharacterStats {
  health: number;
  damage: number;
  speed: number;
  defense: number;
  critChance: number;
  critDamage: number;
}

export type StatEventType = 'statIncrease' | 'statDecrease' | 'statsReset';

export interface StatEvent {
  type: StatEventType;
  data: {
    stat?: keyof CharacterStats;
    value?: number;
    currentStats?: CharacterStats;
  };
}

export class StatSystem extends EventEmitter<StatEvent> {
  private baseStats: CharacterStats = {
    health: 100,
    damage: 10,
    speed: 3,
    defense: 5,
    critChance: 0.05,
    critDamage: 1.5
  };

  private bonusStats: CharacterStats = {
    health: 0,
    damage: 0,
    speed: 0,
    defense: 0,
    critChance: 0,
    critDamage: 0
  };

  private readonly maxStats: CharacterStats = {
    health: 1000,
    damage: 100,
    speed: 10,
    defense: 50,
    critChance: 0.5,
    critDamage: 3.0
  };

  private readonly statMultipliers: Record<keyof CharacterStats, number> = {
    health: 10,
    damage: 2,
    speed: 0.1,
    defense: 1,
    critChance: 0.01,
    critDamage: 0.1
  };

  public addStatPoint(stat: keyof CharacterStats, points: number): boolean {
    if (points <= 0) return false;
    
    const newValue = this.bonusStats[stat] + points * this.statMultipliers[stat];
    if (newValue + this.baseStats[stat] > this.maxStats[stat]) {
      return false;
    }

    this.bonusStats[stat] = newValue;
    
    this.emit('statIncrease', {
      type: 'statIncrease',
      data: {
        stat,
        value: points,
        currentStats: this.getEffectiveStats()
      }
    });

    return true;
  }

  public getEffectiveStats(): CharacterStats {
    return {
      health: this.baseStats.health + this.bonusStats.health,
      damage: this.baseStats.damage + this.bonusStats.damage,
      speed: this.baseStats.speed + this.bonusStats.speed,
      defense: this.baseStats.defense + this.bonusStats.defense,
      critChance: this.baseStats.critChance + this.bonusStats.critChance,
      critDamage: this.baseStats.critDamage + this.bonusStats.critDamage
    };
  }

  public canAddStatPoint(stat: keyof CharacterStats): boolean {
    const potentialValue = this.bonusStats[stat] + this.statMultipliers[stat];
    return (potentialValue + this.baseStats[stat]) <= this.maxStats[stat];
  }

  public getStatProgress(stat: keyof CharacterStats): number {
    const current = this.baseStats[stat] + this.bonusStats[stat];
    const max = this.maxStats[stat];
    return current / max;
  }

  public resetStats(): void {
    this.bonusStats = {
      health: 0,
      damage: 0,
      speed: 0,
      defense: 0,
      critChance: 0,
      critDamage: 0
    };

    this.emit('statsReset', {
      type: 'statsReset',
      data: {
        currentStats: this.getEffectiveStats()
      }
    });
  }

  // 获取基础属性
  public getBaseStat(stat: keyof CharacterStats): number {
    return this.baseStats[stat];
  }

  // 获取加成属性
  public getBonusStat(stat: keyof CharacterStats): number {
    return this.bonusStats[stat];
  }

  // 获取属性上限
  public getMaxStat(stat: keyof CharacterStats): number {
    return this.maxStats[stat];
  }

  // 计算攻击伤害
  public calculateAttackDamage(target: StatSystem, baseDamage: number): DamageResult {
    return StatCalculator.calculateDamage(
      this.getEffectiveStats(),
      target.getEffectiveStats(),
      baseDamage
    );
  }

  // 计算治疗量
  public calculateHealingAmount(baseHealing: number): number {
    return StatCalculator.calculateHealing(
      this.getEffectiveStats(),
      baseHealing
    );
  }

  // 获取当前移动速度
  public getCurrentMoveSpeed(): number {
    return StatCalculator.calculateMoveSpeed(
      this.getEffectiveStats()
    );
  }
} 