import { Vector2D } from '../../utils/Vector2D';

export interface Renderable {
  position: Vector2D;
  type: 'player' | 'enemy' | 'essence';
  color: string;
  size: number;
  health?: number;
  maxHealth?: number;
}

export interface RenderSystem {
  addEntity(id: string, entity: Renderable): void;
  removeEntity(id: string): void;
  updateEntityPosition(id: string, position: Vector2D): void;
  update(deltaTime: number): void;
} 