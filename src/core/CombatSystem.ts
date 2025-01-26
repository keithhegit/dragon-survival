import { GameSystem } from './interfaces/GameSystem';
import { EventEmitter } from '../utils/EventEmitter';
import { Vector2D } from '../utils/Vector2D';

// 攻击模式定义
export type AttackPattern = 'circle' | 'sector' | 'line';

// 技能配置接口
export interface SkillConfig {
  id: string;
  pattern: AttackPattern;
  range: number;
  angle?: number;  // 扇形攻击的角度
  width?: number;  // 直线攻击的宽度
  baseDamage: number;
  cooldown: number;
  damageMultiplier?: number;
}

export interface CombatStats {
  health: number;
  damage: number;
  attackSpeed: number;
  range: number;
  moveSpeed?: number;
  isPlayer?: boolean;
}

export interface CombatEvent {
  type: 'attack' | 'damage' | 'death';
  data: {
    sourceId: string;
    targetId?: string;
    damage?: number;
    position?: Vector2D;
  };
}

export interface CombatState {
  position: Vector2D;
  attackRange: number;
  attackDamage: number;
  attackCooldown: number;
  lastAttackTime: number;
}

export class CombatSystem extends EventEmitter<CombatEvent> implements GameSystem {
  private entities: Map<string, CombatStats> = new Map();
  private positions: Map<string, Vector2D> = new Map();
  private lastAttackTime: Map<string, number> = new Map();
  private targets: Map<string, string> = new Map();

  constructor(private readonly gridSize: number = 32) {
    super();
  }

  public update(deltaTime: number): void {
    // 更新所有实体的战斗状态
    for (const [id, stats] of this.entities) {
      const position = this.positions.get(id);
      if (!position) continue;

      // 检查攻击冷却
      const lastAttack = this.lastAttackTime.get(id) || 0;
      if (Date.now() - lastAttack < (1000 / stats.attackSpeed)) continue;

      // 获取目标
      const target = this.findTarget(id);
      if (!target) continue;

      // 执行攻击
      this.performAttack(id, target);
    }
  }

  public registerEntity(id: string, stats: CombatStats, position: Vector2D): void {
    this.entities.set(id, stats);
    this.positions.set(id, position);
  }

  public updatePosition(entityId: string, position: Vector2D): void {
    this.positions.set(entityId, position);
  }

  public setTarget(entityId: string, targetId: string): void {
    this.targets.set(entityId, targetId);
  }

  private findTarget(sourceId: string): string | undefined {
    const sourcePos = this.positions.get(sourceId);
    const sourceStats = this.entities.get(sourceId);
    if (!sourcePos || !sourceStats) return undefined;

    let nearestTarget: string | undefined;
    let minDistance = Infinity;

    for (const [targetId, targetStats] of this.entities) {
      if (targetId === sourceId) continue;
      
      const targetPos = this.positions.get(targetId);
      if (!targetPos) continue;

      const distance = Vector2D.distance(sourcePos, targetPos);
      if (distance <= sourceStats.range && distance < minDistance) {
        nearestTarget = targetId;
        minDistance = distance;
      }
    }

    return nearestTarget;
  }

  public performAttack(sourceId: string, targetId: string): void {
    const sourceStats = this.entities.get(sourceId);
    const targetStats = this.entities.get(targetId);
    if (!sourceStats || !targetStats) return;
    
    // 计算伤害
    const damage = sourceStats.damage;
    
    // 应用伤害
    this.applyDamage(sourceId, targetId, damage);
    
    // 更新攻击时间
    this.lastAttackTime.set(sourceId, Date.now());
    
    // 发送攻击事件
    this.emit('attack', {
      type: 'attack',
      data: {
        sourceId,
        targetId,
        damage
      }
    });
  }

  private applyDamage(sourceId: string, targetId: string, amount: number): void {
    const targetStats = this.entities.get(targetId);
    if (!targetStats) return;

    targetStats.health -= amount;

    this.emit('damage', {
      type: 'damage',
      data: {
        sourceId,
        targetId,
        damage: amount
      }
    });

    // 检查死亡
    if (targetStats.health <= 0) {
      this.handleDeath(targetId);
    }
  }

  private handleDeath(entityId: string): void {
    this.emit('death', {
      type: 'death',
      data: {
        sourceId: entityId
      }
    });

    // 清理实体数据
    this.entities.delete(entityId);
    this.positions.delete(entityId);
    this.lastAttackTime.delete(entityId);
    this.targets.delete(entityId);

    // 清理其他实体对该实体的目标
    for (const [id, targetId] of this.targets) {
      if (targetId === entityId) {
        this.targets.delete(id);
      }
    }
  }

  public getEntityStats(id: string): CombatStats | undefined {
    return this.entities.get(id);
  }

  public getEntityPosition(id: string): Vector2D | undefined {
    return this.positions.get(id);
  }

  public getCurrentTarget(entityId: string): string | undefined {
    return this.targets.get(entityId);
  }

  // 添加获取所有实体的方法
  public getEntities(): Map<string, CombatStats> {
    return this.entities;
  }

  // 添加获取实体数量的方法
  public getEntityCount(): number {
    return this.entities.size;
  }

  // 添加检查实体是否存在的方法
  public hasEntity(id: string): boolean {
    return this.entities.has(id);
  }

  // 添加移除实体的方法
  public removeEntity(id: string): void {
    this.entities.delete(id);
    this.positions.delete(id);
    this.lastAttackTime.delete(id);
    this.targets.delete(id);
  }

  // 添加更新实体状态的方法
  public updateEntityStats(id: string, stats: Partial<CombatStats>): void {
    const currentStats = this.entities.get(id);
    if (currentStats) {
      this.entities.set(id, { ...currentStats, ...stats });
    }
  }

  // 添加获取实体目标的方法
  public getEntityTarget(id: string): string | undefined {
    return this.targets.get(id);
  }

  // 添加设置实体目标的方法
  public setEntityTarget(id: string, targetId: string): void {
    if (this.entities.has(id) && this.entities.has(targetId)) {
      this.targets.set(id, targetId);
    }
  }

  // 添加清除实体目标的方法
  public clearEntityTarget(id: string): void {
    this.targets.delete(id);
  }

  // 添加获取所有实体位置的方法
  public getAllPositions(): Map<string, Vector2D> {
    return this.positions;
  }

  // 添加获取所有实体目标的方法
  public getAllTargets(): Map<string, string> {
    return this.targets;
  }

  public getLastAttackTime(id: string): number | undefined {
    return this.lastAttackTime.get(id);
  }
} 