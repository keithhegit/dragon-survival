export class PerformanceMonitor {
  private static readonly HISTORY_SIZE = 60; // 1秒60帧
  private frameTimeHistory: number[] = [];
  private lastFrameTime: number = 0;

  public update(): void {
    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.frameTimeHistory.push(frameTime);
    if (this.frameTimeHistory.length > PerformanceMonitor.HISTORY_SIZE) {
      this.frameTimeHistory.shift();
    }
  }

  public getAverageFPS(): number {
    const averageFrameTime = this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length;
    return 1000 / averageFrameTime;
  }

  public shouldThrottle(): boolean {
    return this.getAverageFPS() < 30;
  }
} 