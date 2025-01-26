import { SkillEffect, SkillTarget } from '../SkillEffect';
import { CharacterStats } from '../StatSystem';
import { DamageResult } from '../StatCalculator';

// 燃烧效果
export class BurningEffect implements SkillEffect {
  id = 'burning';
  name = '燃烧';
  description = '每秒造成基于目标最大生命值的伤害';
  duration = 5000; // 5秒
  stacks = 1;
  private tickInterval: number = 1000; // 每秒触发
  private tickTimer?: NodeJS.Timeout;

  modifyStats(baseStats: CharacterStats): CharacterStats {
    return baseStats; // 不修改属性
  }

  onApply(target: SkillTarget): void {
    this.tickTimer = setInterval(() => {
      this.onTick(target);
    }, this.tickInterval);
  }

  onTick(target: SkillTarget): void {
    const damage = target.stats.health * 0.05 * this.stacks; // 5%最大生命值 * 层数
    target.takeDamage?.(damage);
  }

  onRemove(target: SkillTarget): void {
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
    }
  }
}

// 击退效果
export class KnockbackEffect implements SkillEffect {
  constructor(
    public id: string = 'knockback',
    public name: string = '击退',
    public description: string = '击退目标',
    public force: number = 100
  ) {}

  modifyStats(baseStats: CharacterStats): CharacterStats {
    return baseStats;
  }

  onApply(target: SkillTarget): void {
    const direction = {
      x: target.position.x - target.source.x,
      y: target.position.y - target.source.y
    };
    const distance = Math.sqrt(direction.x ** 2 + direction.y ** 2);
    
    if (distance > 0) {
      target.velocity = {
        x: (direction.x / distance) * this.force,
        y: (direction.y / distance) * this.force
      };
    }
  }
}

// 防御增益
export class DefenseBuffEffect implements SkillEffect {
  constructor(
    public id: string = 'defenseBuff',
    public name: string = '防御增益',
    public description: string = '增加防御力',
    public duration: number = 10000,
    private defenseBonus: number = 20
  ) {}

  modifyStats(baseStats: CharacterStats): CharacterStats {
    return {
      ...baseStats,
      defense: baseStats.defense + this.defenseBonus
    };
  }

  modifyDamage(damageResult: DamageResult): DamageResult {
    return {
      ...damageResult,
      damageReduction: Math.min(0.75, damageResult.damageReduction + 0.1) // 最多75%减伤
    };
  }
} 