import { Vector2D } from '@/utils/Vector2D';
import { PerformanceMonitor } from '../core/PerformanceMonitor';

export interface EnemyConfig {
  id: string;
  type: string;
  health: number;
  speed: number;
  damage: number;
}

export interface SpawnState {
  waveNumber: number;
  enemyCount: number;
  spawnInterval: number;
  lastSpawnTime: number;
  spawnRadius: number;
}

export class EnemySpawnSystem {
  private static readonly BASE_ENEMIES: EnemyConfig[] = [
    {
      id: 'basic_enemy',
      type: 'basic',
      health: 100,
      speed: 3,
      damage: 10
    }
  ];

  private static readonly OBJECT_POOL_SIZE = 100;
  private enemyPool: EnemyConfig[] = [];

  private performanceMonitor = new PerformanceMonitor();

  constructor(private readonly gridSize: number = 32) {
    this.initializePool();
  }

  private initializePool(): void {
    for (let i = 0; i < EnemySpawnSystem.OBJECT_POOL_SIZE; i++) {
      this.enemyPool.push({ ...EnemySpawnSystem.BASE_ENEMIES[0] });
    }
  }

  private getFromPool(): EnemyConfig | null {
    return this.enemyPool.pop() || null;
  }

  private returnToPool(enemy: EnemyConfig): void {
    if (this.enemyPool.length < EnemySpawnSystem.OBJECT_POOL_SIZE) {
      this.enemyPool.push(enemy);
    }
  }

  private selectEnemyType(types: { type: string; weight: number; }[]): string {
    const totalWeight = types.reduce((sum, t) => sum + t.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const type of types) {
      random -= type.weight;
      if (random <= 0) return type.type;
    }
    
    return types[0].type;
  }

  public update(state: SpawnState, playerPosition: Vector2D): EnemyConfig | null {
    this.performanceMonitor.update();

    // 如果FPS过低，减少生成
    if (this.performanceMonitor.shouldThrottle()) {
      state.spawnInterval *= 1.5;
    }

    const now = Date.now();
    if (now - state.lastSpawnTime < state.spawnInterval) {
      return null;
    }

    if (this.shouldSpawnEnemy(state)) {
      state.lastSpawnTime = now;
      const enemy = this.getFromPool();
      if (enemy) {
        this.configureEnemy(enemy, state, playerPosition);
        return enemy;
      }
    }

    return null;
  }

  private shouldSpawnEnemy(state: SpawnState): boolean {
    return state.enemyCount < this.getMaxEnemies(state.waveNumber);
  }

  private getMaxEnemies(waveNumber: number): number {
    return Math.floor(10 + waveNumber * 2); // 简单的线性增长
  }

  private configureEnemy(enemy: EnemyConfig, state: SpawnState, playerPosition: Vector2D): void {
    const spawnPosition = this.calculateSpawnPosition(playerPosition, state.spawnRadius);
    Object.assign(enemy, {
      position: spawnPosition,
      health: EnemySpawnSystem.BASE_ENEMIES[0].health * (1 + state.waveNumber * 0.1),
      damage: EnemySpawnSystem.BASE_ENEMIES[0].damage * (1 + state.waveNumber * 0.05)
    });
  }

  private calculateSpawnPosition(playerPosition: Vector2D, radius: number): Vector2D {
    const angle = Math.random() * Math.PI * 2;
    const distance = radius;
    
    return new Vector2D(
      playerPosition.x + Math.cos(angle) * distance,
      playerPosition.y + Math.sin(angle) * distance
    );
  }

  public getActiveEnemyCount(): number {
    return EnemySpawnSystem.OBJECT_POOL_SIZE - this.enemyPool.length;
  }

  public getPoolSize(): number {
    return this.enemyPool.length;
  }
} 