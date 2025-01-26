import { SkillData } from '../SkillSystem';
import { BurningEffect, StrengthBuffEffect, KnockbackEffect, DefenseBuffEffect } from '../SkillEffect';

// 龙息技能树
export const DRAGON_BREATH_SKILLS: Record<string, SkillData> = {
  // 基础龙息
  basicBreath: {
    id: 'basicBreath',
    name: '幼龙吐息',
    level: 1,
    maxLevel: 8,
    baseCooldown: 2000,
    baseEffect: 10,
    description: '发射一道龙息，对直线范围内的敌人造成伤害',
    effects: [],
    scaling: {
      damage: (level) => 10 + level * 5,
      range: (level) => 100 + level * 20
    }
  },

  // 扩散龙息
  spreadBreath: {
    id: 'spreadBreath',
    name: '扩散吐息',
    level: 1,
    maxLevel: 5,
    baseCooldown: 3000,
    baseEffect: 15,
    description: '发射一道扇形龙息，对范围内的敌人造成伤害',
    effects: [
      new BurningEffect(),
      new KnockbackEffect('breathKnock', '龙息冲击', '击退敌人', 50)
    ],
    requirements: {
      level: 3,
      skills: ['basicBreath']
    }
  },

  // 元素龙息
  elementalBreath: {
    id: 'elementalBreath',
    name: '元素吐息',
    level: 1,
    maxLevel: 5,
    baseCooldown: 4000,
    baseEffect: 20,
    description: '发射带有元素效果的龙息',
    effects: [
      new BurningEffect(),
      new DefenseBuffEffect('elementalDefense', '元素护盾', '增加防御', 5000, 10)
    ],
    requirements: {
      level: 5,
      skills: ['spreadBreath']
    }
  }
};

// 龙翼技能树
export const DRAGON_WING_SKILLS: Record<string, SkillData> = {
  // 翼击
  wingSlash: {
    id: 'wingSlash',
    name: '翼击',
    level: 1,
    maxLevel: 5,
    baseCooldown: 3000,
    baseEffect: 15,
    description: '挥动龙翼击退周围敌人',
    effects: [],
    scaling: {
      knockback: (level) => 50 + level * 10
    }
  },

  // 龙卷风暴
  whirlwind: {
    id: 'whirlwind',
    name: '龙卷风暴',
    level: 1,
    maxLevel: 5,
    baseCooldown: 8000,
    baseEffect: 25,
    description: '快速旋转产生龙卷风，持续伤害周围敌人',
    effects: [],
    requirements: {
      level: 4,
      skills: ['wingSlash']
    }
  }
};

// 龙鳞技能树
export const DRAGON_SCALE_SKILLS: Record<string, SkillData> = {
  // 龙鳞护甲
  scaleArmor: {
    id: 'scaleArmor',
    name: '龙鳞护甲',
    level: 1,
    maxLevel: 5,
    baseCooldown: 0, // 被动技能
    baseEffect: 0,
    description: '增加防御力和生命值',
    effects: [],
    scaling: {
      defense: (level) => level * 5,
      health: (level) => level * 20
    }
  },

  // 鳞片反射
  scaleReflection: {
    id: 'scaleReflection',
    name: '鳞片反射',
    level: 1,
    maxLevel: 5,
    baseCooldown: 0, // 被动技能
    baseEffect: 0,
    description: '反弹部分受到的伤害',
    effects: [],
    requirements: {
      level: 3,
      skills: ['scaleArmor']
    },
    scaling: {
      reflection: (level) => 0.1 + level * 0.05 // 10-35%反伤
    }
  }
}; 