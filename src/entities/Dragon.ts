import * as PIXI from 'pixi.js';
import { AssetLoader } from '@/core/AssetLoader';
import { InputState } from '@/types/input';
import { Vector2D } from '@/utils/Vector2D';
import { GridSystem } from '@/core/GridSystem';
import { MovementSystem, MovementState } from '@/core/MovementSystem';

export class Dragon {
  public sprite: PIXI.Sprite;
  private speed: number = 5;
  private movementState: MovementState;
  private gridSystem: GridSystem;
  private movementSystem: MovementSystem;

  constructor(gridSystem: GridSystem) {
    this.sprite = new PIXI.Sprite(AssetLoader.getTexture('dragon'));
    this.sprite.anchor.set(0.5);
    this.gridSystem = gridSystem;
    this.movementSystem = new MovementSystem(gridSystem);
    this.movementState = {
      position: new Vector2D(),
      velocity: new Vector2D(),
      isMoving: false
    };
  }

  public update(delta: number, input: InputState): void {
    // 更新移动状态
    this.movementState.isMoving = input.isMoving;
    if (this.movementState.isMoving) {
      this.movementState.velocity = input.direction.multiply(this.speed);
    }
    
    // 应用移动系统
    this.movementState = this.movementSystem.update(this.movementState, delta);
    
    // 更新精灵位置
    this.sprite.x = this.movementState.position.x;
    this.sprite.y = this.movementState.position.y;
  }
} 