export type EnemyType = 'basic' | 'fast' | 'tank' | 'ranged' | 'boss';

export interface EnemyStats {
  baseHealth: number;
  baseDamage: number;
  baseAttackSpeed: number;
  baseRange: number;
  baseMoveSpeed: number;
  size: number;
  color: string;
  eliteColor: string;
  description: string;
}

export const EnemyConfig: Record<EnemyType, EnemyStats> = {
  basic: {
    baseHealth: 100,
    baseDamage: 10,
    baseAttackSpeed: 1,
    baseRange: 50,
    baseMoveSpeed: 100,
    size: 15,
    color: '#ff4444',
    eliteColor: '#ff0000',
    description: '基础敌人，属性平衡'
  },
  fast: {
    baseHealth: 60,
    baseDamage: 8,
    baseAttackSpeed: 1.5,
    baseRange: 40,
    baseMoveSpeed: 150,
    size: 12,
    color: '#44ff44',
    eliteColor: '#00ff00',
    description: '快速敌人，移动速度快但生命值低'
  },
  tank: {
    baseHealth: 200,
    baseDamage: 15,
    baseAttackSpeed: 0.7,
    baseRange: 45,
    baseMoveSpeed: 70,
    size: 20,
    color: '#4444ff',
    eliteColor: '#0000ff',
    description: '坦克敌人，生命值高但移动速度慢'
  },
  ranged: {
    baseHealth: 80,
    baseDamage: 12,
    baseAttackSpeed: 0.8,
    baseRange: 150,
    baseMoveSpeed: 90,
    size: 14,
    color: '#ffff44',
    eliteColor: '#ffff00',
    description: '远程敌人，攻击范围大但生命值低'
  },
  boss: {
    baseHealth: 1000,
    baseDamage: 30,
    baseAttackSpeed: 0.5,
    baseRange: 100,
    baseMoveSpeed: 60,
    size: 30,
    color: '#ff44ff',
    eliteColor: '#ff00ff',
    description: 'Boss敌人，全属性强化'
  }
};

// 敌人行为配置
export interface EnemyBehavior {
  attackPattern: 'melee' | 'ranged' | 'aoe';
  movePattern: 'chase' | 'circle' | 'zigzag';
  specialAbilities?: string[];
}

export const EnemyBehaviors: Record<EnemyType, EnemyBehavior> = {
  basic: {
    attackPattern: 'melee',
    movePattern: 'chase'
  },
  fast: {
    attackPattern: 'melee',
    movePattern: 'zigzag',
    specialAbilities: ['dash']
  },
  tank: {
    attackPattern: 'melee',
    movePattern: 'chase',
    specialAbilities: ['shield']
  },
  ranged: {
    attackPattern: 'ranged',
    movePattern: 'circle',
    specialAbilities: ['multishot']
  },
  boss: {
    attackPattern: 'aoe',
    movePattern: 'chase',
    specialAbilities: ['summon', 'rage', 'heal']
  }
};

// 敌人掉落配置
export interface EnemyDrop {
  essenceType: 'small' | 'medium' | 'large' | 'boss';
  dropRate: number;
  maxDrops: number;
}

export const EnemyDrops: Record<EnemyType, EnemyDrop> = {
  basic: {
    essenceType: 'small',
    dropRate: 0.7,
    maxDrops: 1
  },
  fast: {
    essenceType: 'small',
    dropRate: 0.8,
    maxDrops: 2
  },
  tank: {
    essenceType: 'medium',
    dropRate: 0.9,
    maxDrops: 2
  },
  ranged: {
    essenceType: 'medium',
    dropRate: 0.85,
    maxDrops: 2
  },
  boss: {
    essenceType: 'boss',
    dropRate: 1,
    maxDrops: 5
  }
}; 