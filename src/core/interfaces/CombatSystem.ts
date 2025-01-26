import { Vector2D } from '../../utils/Vector2D';

export interface CombatStats {
  health: number;
  maxHealth?: number;
  damage: number;
  attackSpeed: number;
  range: number;
}

export interface CombatSystem {
  registerEntity(id: string, stats: CombatStats, position: Vector2D): void;
  getEntityStats(id: string): CombatStats | undefined;
  getEntityPosition(id: string): Vector2D | undefined;
  update(deltaTime: number): void;
} 