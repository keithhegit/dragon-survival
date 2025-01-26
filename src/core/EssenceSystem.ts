import { GameSystem } from './interfaces/GameSystem';
import { EventEmitter } from '../utils/EventEmitter';
import { Vector2D } from '../utils/Vector2D';
import { RenderSystem } from './interfaces/RenderSystem';
import { CombatSystem } from './interfaces/CombatSystem';

export enum EssenceType {
  SMALL = 'small',   // 小型魔物精华
  MEDIUM = 'medium', // 中型魔物精华
  LARGE = 'large',   // 大型魔物精华
  BOSS = 'boss'      // 首领精华
}

export interface EssenceData {
  type: EssenceType;
  baseExp: number;
  dropRate: number;  // 掉落概率 0-1
  maxDrops: number;  // 最大掉落数量
  duration: number;  // 存在时间(ms)
  radius: number;    // 拾取范围
  color: string;     // 显示颜色
}

export const ESSENCE_CONFIG: Record<EssenceType, EssenceData> = {
  [EssenceType.SMALL]: {
    type: EssenceType.SMALL,
    baseExp: 10,
    dropRate: 0.7,
    maxDrops: 2,
    duration: 10000,
    radius: 20,
    color: '#7FFF00'
  },
  [EssenceType.MEDIUM]: {
    type: EssenceType.MEDIUM,
    baseExp: 25,
    dropRate: 0.5,
    maxDrops: 3,
    duration: 15000,
    radius: 25,
    color: '#00FFFF'
  },
  [EssenceType.LARGE]: {
    type: EssenceType.LARGE,
    baseExp: 50,
    dropRate: 0.3,
    maxDrops: 4,
    duration: 20000,
    radius: 30,
    color: '#FF00FF'
  },
  [EssenceType.BOSS]: {
    type: EssenceType.BOSS,
    baseExp: 200,
    dropRate: 1.0,
    maxDrops: 5,
    duration: 30000,
    radius: 40,
    color: '#FFD700'
  }
};

export interface Essence {
  id: string;
  type: 'small' | 'medium' | 'large' | 'boss';
  position: Vector2D;
  expValue: number;
  lifeTime: number;
  spawnTime: number;
  collectRadius: number;
}

export interface EssenceEvent {
  type: 'spawn' | 'collect' | 'expire';
  data: {
    essence: Essence;
    expGained?: number;
  };
}

export class EssenceSystem extends EventEmitter<EssenceEvent> implements GameSystem {
  private essences: Map<string, Essence> = new Map();
  private nextId: number = 0;

  constructor(private readonly renderSystem: RenderSystem, private readonly combatSystem: CombatSystem) {
    super();
  }

  public update(deltaTime: number): void {
    const now = Date.now();
    
    // 更新所有精华
    for (const [id, essence] of this.essences) {
      // 检查存在时间
      if (now - essence.spawnTime > essence.lifeTime * 1000) {
        this.removeEssence(id, 'expire');
        continue;
      }

      // 检查收集范围
      const playerPos = this.combatSystem.getEntityPosition('player');
      if (playerPos && Vector2D.distance(playerPos, essence.position) < essence.collectRadius) {
        this.collectEssence(id);
      }
    }
  }

  public spawnEssence(type: EssenceType, position: Vector2D): void {
    const essence: Essence = {
      id: `essence_${this.nextId++}`,
      type,
      position,
      expValue: this.getExpValue(type),
      lifeTime: ESSENCE_CONFIG[type].duration,
      spawnTime: Date.now(),
      collectRadius: ESSENCE_CONFIG[type].radius
    };

    this.essences.set(essence.id, essence);
    
    // 注册到渲染系统
    this.renderSystem.addEntity(essence.id, {
      position: essence.position,
      type: 'essence',
      color: ESSENCE_CONFIG[type].color,
      size: 8
    });

    this.emit('spawn', { type: 'spawn', data: { essence } });
  }

  public collectEssence(id: string): void {
    const essence = this.essences.get(id);
    if (!essence) return;

    // 发送收集事件
    this.emit('collect', {
      type: 'collect',
      data: {
        essence,
        expGained: essence.expValue
      }
    });

    // 移除精华
    this.removeEssence(id, 'collect');
  }

  private removeEssence(id: string, reason: 'collect' | 'expire'): void {
    const essence = this.essences.get(id);
    if (!essence) return;

    this.essences.delete(id);
    this.emit(reason, {
      type: reason,
      data: {
        essence,
        expGained: reason === 'collect' ? essence.expValue : 0
      }
    });
  }

  private getExpValue(type: Essence['type']): number {
    switch (type) {
      case 'small': return 10;
      case 'medium': return 25;
      case 'large': return 50;
      case 'boss': return 100;
    }
  }

  // 获取指定范围内的所有精华
  public getEssencesInRange(position: { x: number; y: number }, radius: number): Essence[] {
    return Array.from(this.essences.values()).filter(essence => {
      if (essence.lifeTime <= 0) return false;

      const distance = Math.sqrt(
        Math.pow(position.x - essence.position.x, 2) +
        Math.pow(position.y - essence.position.y, 2)
      );

      return distance <= radius;
    });
  }

  // 清理所有精华
  public clearAllEssences(): void {
    this.essences.clear();
  }
} 