import { CharacterStats } from './StatSystem';

export interface DamageResult {
  finalDamage: number;
  isCritical: boolean;
  damageReduction: number;
}

export class StatCalculator {
  // 计算最终伤害
  public static calculateDamage(
    attackerStats: CharacterStats,
    defenderStats: CharacterStats,
    baseDamage: number
  ): DamageResult {
    // 暴击判定
    const isCritical = Math.random() < attackerStats.critChance;
    
    // 基础伤害计算
    let damage = baseDamage + attackerStats.damage;
    
    // 暴击伤害
    if (isCritical) {
      damage *= attackerStats.critDamage;
    }
    
    // 防御减伤计算 (防御公式: 减伤比例 = 防御/(防御+100))
    const damageReduction = defenderStats.defense / (defenderStats.defense + 100);
    const finalDamage = Math.max(0, damage * (1 - damageReduction));

    return {
      finalDamage: Math.round(finalDamage),
      isCritical,
      damageReduction
    };
  }

  // 计算生命值恢复
  public static calculateHealing(
    healerStats: CharacterStats,
    baseHealing: number
  ): number {
    // 治疗量受治疗者生命值上限影响
    const healingMultiplier = 1 + (healerStats.health / 1000);
    return Math.round(baseHealing * healingMultiplier);
  }

  // 计算移动速度
  public static calculateMoveSpeed(stats: CharacterStats): number {
    // 基础移动速度 + 速度加成，但有上限
    return Math.min(stats.speed, 10);
  }
} 