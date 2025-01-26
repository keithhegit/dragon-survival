import { GameSystem } from './interfaces/GameSystem';
import { GridSystem } from './GridSystem';
import { Vector2D } from '../utils/Vector2D';
import { InputManager } from './InputManager';

export interface MovementState {
  position: Vector2D;
  velocity: Vector2D;
  isMoving: boolean;
}

export class MovementSystem implements GameSystem {
  private state: MovementState;
  private gridSystem: GridSystem;
  private inputManager: InputManager;
  private readonly baseSpeed: number = 200;
  private readonly maxSpeed: number = 10;
  private readonly snapThreshold: number = 0.1;

  constructor(gridSystem: GridSystem) {
    this.gridSystem = gridSystem;
    this.inputManager = InputManager.getInstance();
    this.state = {
      position: new Vector2D(0, 0),
      velocity: new Vector2D(0, 0),
      isMoving: false
    };
  }

  public update(deltaTime: number): void {
    // 获取输入方向
    const moveDirection = this.inputManager.getMoveDirection();
    
    // 更新移动状态
    if (!moveDirection.isZero()) {
      this.state.velocity = moveDirection.multiply(this.baseSpeed);
      this.state.isMoving = true;
    } else {
      this.state.velocity = new Vector2D(0, 0);
      this.state.isMoving = false;
    }

    // 更新位置
    if (this.state.isMoving) {
      const newPosition = this.state.position.add(
        this.state.velocity.multiply(deltaTime)
      );

      if (this.gridSystem.isWalkable(newPosition)) {
        this.state.position = newPosition;
      } else {
        this.handleCollision(newPosition);
      }
    } else {
      this.handleSnapping();
    }
  }

  private handleSnapping(): void {
    const gridPosition = this.gridSystem.snapToGrid(this.state.position);
    const distance = Vector2D.distance(this.state.position, gridPosition);

    if (distance < this.snapThreshold) {
      this.state.position = gridPosition;
    }
  }

  private handleCollision(newPosition: Vector2D): void {
    // 实现碰撞处理逻辑
    const currentCell = this.gridSystem.worldToGrid(this.state.position);
    const targetCell = this.gridSystem.worldToGrid(newPosition);

    // 尝试水平移动
    const horizontalPosition = new Vector2D(
      newPosition.x,
      this.state.position.y
    );
    if (this.gridSystem.isWalkable(horizontalPosition)) {
      this.state.position = horizontalPosition;
      return;
    }

    // 尝试垂直移动
    const verticalPosition = new Vector2D(
      this.state.position.x,
      newPosition.y
    );
    if (this.gridSystem.isWalkable(verticalPosition)) {
      this.state.position = verticalPosition;
    }
  }

  public moveTowards(target: Vector2D): void {
    const direction = target.subtract(this.state.position).normalize();
    this.setVelocity(direction);
  }

  public setVelocity(velocity: Vector2D): void {
    this.state.velocity = velocity.normalize().multiply(this.baseSpeed);
    this.state.isMoving = !velocity.isZero();
  }

  public getPosition(): Vector2D {
    return this.state.position;
  }

  public setPosition(position: Vector2D): void {
    this.state.position = position;
  }
} 