import { GameSystem } from './interfaces/GameSystem';

export class GameLoop {
  private lastTime: number = 0;
  private systems: GameSystem[] = [];
  private isRunning: boolean = false;
  private frameId: number = 0;

  constructor() {
    // 移除构造函数中的系统初始化
  }

  public addSystem(system: GameSystem): void {
    // 检查系统是否实现了 update 方法
    if (!system || typeof system.update !== 'function') {
      console.warn('Attempted to add invalid system:', system);
      return;
    }
    this.systems.push(system);
  }

  public start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.loop.bind(this));
  }

  public stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    cancelAnimationFrame(this.frameId);
  }

  private loop(currentTime: number): void {
    if (!this.isRunning) return;

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    try {
      for (const system of this.systems) {
        system.update(deltaTime);
      }
    } catch (error) {
      console.error('Error in game loop:', error);
      this.stop();
      return;
    }

    this.frameId = requestAnimationFrame(this.loop.bind(this));
  }

  public removeSystem(system: GameSystem): void {
    const index = this.systems.indexOf(system);
    if (index > -1) {
      this.systems.splice(index, 1);
    }
  }
} 