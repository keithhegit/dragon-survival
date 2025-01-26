import { PerformanceCenter } from '../core/PerformanceCenter';
import { SpawnDebugger } from './SpawnDebugger';

export class DebugConsole {
  private static instance: DebugConsole;
  
  private constructor() {} // 私有构造函数

  public static getInstance(): DebugConsole {
    if (!this.instance) {
      this.instance = new DebugConsole();
    }
    return this.instance;
  }

  public showSystemStatus(): void {
    const metrics = PerformanceCenter.getInstance().getSystemMetrics();
    console.table({
      movement: metrics.movement,
      combat: metrics.combat,
      spawn: metrics.spawn
    });
  }

  public toggleDebugView(): void {
    SpawnDebugger.getInstance().toggle();
  }
} 