import { GameSystem } from './interfaces/GameSystem';
import { Vector2D } from '../utils/Vector2D';
import { AssetLoader } from './AssetLoader';

interface Renderable {
  position: Vector2D;
  type: 'player' | 'enemy' | 'essence';
  color: string;
  size: number;
  health?: number;      // 添加生命值
  maxHealth?: number;   // 添加最大生命值
  direction?: Vector2D; // 添加朝向属性
}

export class RenderSystem implements GameSystem, RenderSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private entities: Map<string, Renderable> = new Map();
  private readonly aspectRatio = 9/16;

  constructor() {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!canvas) throw new Error('Canvas element not found');

    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D context');
    
    this.ctx = ctx;
    this.setupCanvas();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private setupCanvas(): void {
    const container = this.canvas.parentElement;
    if (!container) return;

    // 使用容器的尺寸
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;

    // 清除之前的变换
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // 设置坐标系原点在中心
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    
    // 清除画布
    this.clear();
  }

  private handleResize(): void {
    this.setupCanvas();
  }

  public update(deltaTime: number): void {
    this.clear();
    
    // 保存当前状态
    this.ctx.save();
    
    // 渲染所有实体
    for (const entity of this.entities.values()) {
      this.renderEntity(entity);
    }
    
    // 恢复状态
    this.ctx.restore();
  }

  private clear(): void {
    // 清除整个画布，包括变换后的区域
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }

  private render(): void {
    // 渲染所有实体
    for (const entity of this.entities.values()) {
      this.renderEntity(entity);
    }
  }

  private renderEntity(entity: Renderable): void {
    this.ctx.save();
    
    const { x, y } = entity.position;
    const size = entity.size;

    // 如果是敌人且有生命值，绘制血条
    if (entity.type === 'enemy' && entity.health !== undefined && entity.maxHealth !== undefined) {
      this.renderHealthBar(x, y - size - 10, entity.health, entity.maxHealth);
    }

    // 根据实体类型渲染
    switch (entity.type) {
      case 'player':
        this.renderPlayer(x, y, size, entity);
        break;
      case 'enemy':
        this.renderEnemy(x, y, size, entity.color);
        break;
      case 'essence':
        this.renderEssence(x, y, size, entity.color);
        break;
    }

    this.ctx.restore();
  }

  private renderHealthBar(x: number, y: number, health: number, maxHealth: number): void {
    const width = 40;
    const height = 4;
    const healthPercent = health / maxHealth;

    // 血条背景
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(x - width/2, y - height/2, width, height);

    // 血条
    this.ctx.fillStyle = '#ff4444';
    this.ctx.fillRect(x - width/2, y - height/2, width * healthPercent, height);
  }

  private renderPlayer(x: number, y: number, size: number, entity: Renderable): void {
    const dragonImage = AssetLoader.getLoadedImage('/src/assets/IMG/dragon.png');
    if (dragonImage) {
      this.ctx.save();
      this.ctx.translate(x, y);
      
      // 根据移动方向旋转
      if (entity.direction) {
        const angle = Math.atan2(entity.direction.y, entity.direction.x);
        this.ctx.rotate(angle);
      }
      
      const scale = (size * 2) / Math.max(dragonImage.width, dragonImage.height);
      this.ctx.scale(scale, scale);
      
      this.ctx.drawImage(
        dragonImage,
        -dragonImage.width / 2,
        -dragonImage.height / 2,
        dragonImage.width,
        dragonImage.height
      );
      
      this.ctx.restore();
    }
  }

  private renderEnemy(x: number, y: number, size: number, color: string): void {
    // 绘制敌人（红色圆形带绿色边框）
    this.ctx.beginPath();
    this.ctx.fillStyle = color || '#ff4444';
    this.ctx.strokeStyle = '#2ecc71';
    this.ctx.lineWidth = 2;
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();
  }

  private renderEssence(x: number, y: number, size: number, color: string): void {
    // 绘制精华（黄色小圆）
    this.ctx.beginPath();
    this.ctx.fillStyle = color || '#f1c40f';
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  public addEntity(id: string, entity: Renderable): void {
    this.entities.set(id, entity);
  }

  public removeEntity(id: string): void {
    this.entities.delete(id);
  }

  public updateEntityPosition(id: string, position: Vector2D): void {
    const entity = this.entities.get(id);
    if (entity) {
      entity.position = position;
    }
  }

  public updateEntityDirection(id: string, direction: Vector2D): void {
    const entity = this.entities.get(id);
    if (entity) {
      entity.direction = direction;
    }
  }

  // 添加获取画布宽度的方法
  public getWidth(): number {
    return this.canvas.width;
  }

  // 添加获取画布高度的方法
  public getHeight(): number {
    return this.canvas.height;
  }

  // 添加获取画布中心点的方法
  public getCenter(): Vector2D {
    return new Vector2D(
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }

  // 添加获取画布边界的方法
  public getBounds(): {
    left: number;
    right: number;
    top: number;
    bottom: number;
  } {
    return {
      left: -this.canvas.width / 2,
      right: this.canvas.width / 2,
      top: -this.canvas.height / 2,
      bottom: this.canvas.height / 2
    };
  }

  // 添加检查点是否在画布内的方法
  public isInBounds(position: Vector2D): boolean {
    const bounds = this.getBounds();
    return (
      position.x >= bounds.left &&
      position.x <= bounds.right &&
      position.y >= bounds.top &&
      position.y <= bounds.bottom
    );
  }
} 