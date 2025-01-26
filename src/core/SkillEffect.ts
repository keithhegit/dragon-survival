import { CharacterStats } from './StatSystem';
import { DamageResult } from './StatCalculator';

export type SkillTarget = {
  stats: CharacterStats;
  position: { x: number; y: number };
};

export interface SkillEffect {
  id: string;
  name: string;
  description: string;
  duration?: number;
  stacks?: number;
  
  // 效果计算
  modifyStats(baseStats: CharacterStats): CharacterStats;
  modifyDamage?(damageResult: DamageResult): DamageResult;
  onTick?(target: SkillTarget): void;
  onApply?(target: SkillTarget): void;
  onRemove?(target: SkillTarget): void;
}

// 技能效果实现示例
export class BurningEffect implements SkillEffect {
  id = 'burning';
  name = '燃烧';
  description = '每秒造成基于目标最大生命值的伤害';
  duration = 5000; // 5秒
  
  modifyStats(baseStats: CharacterStats): CharacterStats {
    return baseStats; // 不修改属性
  }
  
  onTick(target: SkillTarget): void {
    const damage = target.stats.health * 0.05; // 5%最大生命值
    // 应用伤害...
  }
}

export class StrengthBuffEffect implements SkillEffect {
  id = 'strengthBuff';
  name = '力量增益';
  description = '增加攻击力';
  duration = 10000; // 10秒
  
  modifyStats(baseStats: CharacterStats): CharacterStats {
    return {
      ...baseStats,
      damage: baseStats.damage * 1.2 // 增加20%攻击力
    };
  }
} 