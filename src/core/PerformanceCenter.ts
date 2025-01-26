import { PerformanceMonitor } from './PerformanceMonitor';

export class PerformanceCenter {
  private static instance: PerformanceCenter;
  private monitors: Map<string, PerformanceMonitor> = new Map();

  private constructor() {} // 私有构造函数

  public static getInstance(): PerformanceCenter {
    if (!this.instance) {
      this.instance = new PerformanceCenter();
    }
    return this.instance;
  }

  public addMonitor(name: string): void {
    this.monitors.set(name, new PerformanceMonitor());
  }

  public updateSystem(name: string): void {
    this.monitors.get(name)?.update();
  }

  public shouldThrottleSystem(name: string): boolean {
    return this.monitors.get(name)?.shouldThrottle() || false;
  }

  public getSystemMetrics(): Record<string, number> {
    const metrics: Record<string, number> = {};
    this.monitors.forEach((monitor, name) => {
      metrics[name] = monitor.getAverageFPS();
    });
    return metrics;
  }
} 