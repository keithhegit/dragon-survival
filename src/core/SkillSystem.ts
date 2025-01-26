import { EventEmitter } from '@/utils/EventEmitter';
import { SkillEffect, SkillTarget } from './SkillEffect';
import { CooldownSystem } from './CooldownSystem';

export interface SkillScaling {
  damage?: (level: number) => number;
  range?: (level: number) => number;
  knockback?: (level: number) => number;
  defense?: (level: number) => number;
  health?: (level: number) => number;
  reflection?: (level: number) => number;
}

export interface SkillData {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  baseCooldown: number;
  baseEffect: number;
  description: string;
  effects: SkillEffect[];
  scaling?: SkillScaling;
  requirements?: {
    level?: number;
    skills?: string[];
  };
}

export type SkillEventType = 'skillUnlock' | 'skillUpgrade' | 'skillUse' | 'skillReady';

export interface SkillEvent {
  type: SkillEventType;
  data: {
    skillId: string;
    level?: number;
    target?: SkillTarget;
    cooldown?: number;
  };
}

export class SkillSystem extends EventEmitter<SkillEvent> {
  private unlockedSkills: Map<string, SkillData> = new Map();
  private activeEffects: Map<string, Set<SkillEffect>> = new Map();
  private cooldownSystem: CooldownSystem;
  private skillTree: Record<string, string[]> = {
    'basicAttack': ['powerStrike', 'quickSlash'],
    'powerStrike': ['heavyBlow', 'whirlwind'],
    'quickSlash': ['dualStrike', 'swiftness']
  };

  constructor() {
    super();
    this.cooldownSystem = new CooldownSystem();
    
    // 监听冷却结束事件
    this.cooldownSystem.on('end', (event) => {
      this.emit('skillReady', {
        type: 'skillReady',
        data: {
          skillId: event.data.skillId
        }
      });
    });
  }

  public canUnlockSkill(skillId: string): boolean {
    const skill = this.getSkillData(skillId);
    if (!skill || this.unlockedSkills.has(skillId)) return false;

    // 检查前置技能
    const prerequisites = this.skillTree[skillId];
    if (prerequisites) {
      return prerequisites.some(preSkill => 
        this.unlockedSkills.has(preSkill)
      );
    }

    return true;
  }

  public unlockSkill(skillId: string): boolean {
    if (!this.canUnlockSkill(skillId)) return false;
    
    const skillData = this.getSkillData(skillId);
    this.unlockedSkills.set(skillId, { ...skillData, level: 1 });
    return true;
  }

  public upgradeSkill(skillId: string): boolean {
    const skill = this.unlockedSkills.get(skillId);
    if (!skill || skill.level >= skill.maxLevel) return false;

    skill.level++;
    return true;
  }

  public canUseSkill(skillId: string): boolean {
    const skill = this.unlockedSkills.get(skillId);
    if (!skill) return false;

    // 检查冷却
    return !this.cooldownSystem.isOnCooldown(skillId);
  }

  public useSkill(skillId: string, target: SkillTarget): boolean {
    if (!this.canUseSkill(skillId)) return false;

    const skill = this.unlockedSkills.get(skillId);
    if (!skill) return false;

    // 应用技能效果
    skill.effects.forEach(effect => {
      this.applyEffect(target, effect);
    });

    // 开始冷却
    this.cooldownSystem.startCooldown(skillId, skill.baseCooldown);

    this.emit('skillUse', {
      type: 'skillUse',
      data: {
        skillId,
        target,
        cooldown: skill.baseCooldown
      }
    });

    return true;
  }

  public getSkillCooldown(skillId: string): number {
    return this.cooldownSystem.getRemainingTime(skillId);
  }

  public getSkillCooldownProgress(skillId: string): number {
    return this.cooldownSystem.getCooldownProgress(skillId);
  }

  public reduceCooldown(skillId: string, amount: number): void {
    this.cooldownSystem.reduceCooldown(skillId, amount);
  }

  public resetCooldown(skillId: string): void {
    this.cooldownSystem.resetCooldown(skillId);
  }

  public update(): void {
    this.cooldownSystem.update();
  }

  private applyEffect(target: SkillTarget, effect: SkillEffect): void {
    const targetEffects = this.activeEffects.get(target.stats.id) || new Set();
    targetEffects.add(effect);
    this.activeEffects.set(target.stats.id, targetEffects);

    if (effect.onApply) {
      effect.onApply(target);
    }

    if (effect.duration) {
      setTimeout(() => {
        this.removeEffect(target, effect);
      }, effect.duration);
    }
  }

  private removeEffect(target: SkillTarget, effect: SkillEffect): void {
    const targetEffects = this.activeEffects.get(target.stats.id);
    if (!targetEffects) return;

    targetEffects.delete(effect);
    if (effect.onRemove) {
      effect.onRemove(target);
    }
  }

  // 获取目标当前所有效果
  public getActiveEffects(targetId: string): SkillEffect[] {
    return Array.from(this.activeEffects.get(targetId) || []);
  }
} 