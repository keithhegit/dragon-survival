import { GameSystem } from './interfaces/GameSystem';
import { EventEmitter } from '../utils/EventEmitter';
import { Vector2D } from '../utils/Vector2D';
import { RenderSystem } from './interfaces/RenderSystem';
import { CombatSystem } from './interfaces/CombatSystem';
import { EnemyConfig, EnemyType } from './EnemyConfig';

export interface WaveConfig {
  waveNumber: number;
  duration: number;      // 波次持续时间
  spawnInterval: number; // 生成间隔
  enemyCount: number;    // 敌人数量
  enemyTypes: {         // 敌人类型及权重
    type: string;
    weight: number;
  }[];
  eliteConfig?: {       // 精英敌人配置
    chance: number;     // 精英敌人出现概率
    statMultiplier: {   // 精英属性倍率
      health: number;
      damage: number;
      speed: number;
    };
  };
  stats: {              // 基础属性倍率
    health: number;
    damage: number;
    speed: number;
  };
}

export type WaveEventType = 'waveStart' | 'waveEnd' | 'eliteSpawn';

export interface WaveEvent {
  type: WaveEventType;
  wave: WaveConfig;
  time: number;
}

export enum WaveState {
  PREPARING,  // 波次准备中
  SPAWNING,   // 正在生成敌人
  CLEARING,   // 清理阶段
  COMPLETED   // 波次完成
}

export class WaveSystem extends EventEmitter<WaveEvent> implements GameSystem {
  public static readonly WAVE_CONFIGS: WaveConfig[] = [
    {
      waveNumber: 1,
      duration: 60000,    // 60秒
      spawnInterval: 2000,// 2秒一个
      enemyCount: 20,
      enemyTypes: [
        { type: 'basic', weight: 1 }
      ],
      stats: {
        health: 1,
        damage: 1,
        speed: 1
      }
    },
    {
      waveNumber: 2,
      duration: 90000,
      spawnInterval: 1500,
      enemyCount: 40,
      enemyTypes: [
        { type: 'basic', weight: 0.7 },
        { type: 'fast', weight: 0.3 }
      ],
      eliteConfig: {
        chance: 0.1,    // 10%概率出现精英
        statMultiplier: {
          health: 2.5,
          damage: 1.5,
          speed: 1.2
        }
      },
      stats: {
        health: 1.2,
        damage: 1.1,
        speed: 1.1
      }
    }
    // ... 更多波次配置
  ];

  private waveStartTime: number = 0;
  private currentWaveIndex: number = 0;
  private eventListeners: Map<WaveEventType, Set<(event: WaveEvent) => void>> = new Map();
  private waveState: WaveState = WaveState.PREPARING;
  private waveNumber: number = 0;
  private waveTime: number = 0;
  private readonly waveDuration: number = 30; // 30秒一波
  private lastSpawnTime: number = 0;
  private readonly spawnInterval: number = 2; // 2秒生成一个敌人

  constructor(
    private readonly renderSystem: RenderSystem,
    private readonly combatSystem: CombatSystem
  ) {
    super();
    this.waveStartTime = Date.now();
    this.startWave(); // 开始第一波
  }

  public update(deltaTime: number): void {
    this.waveTime += deltaTime;
    this.lastSpawnTime += deltaTime;

    // 检查当前波次配置
    const currentWave = WaveSystem.WAVE_CONFIGS[this.currentWaveIndex];
    
    // 根据波次配置生成敌人
    if (this.lastSpawnTime >= currentWave.spawnInterval / 1000) {
      this.spawnEnemy(currentWave);
      this.lastSpawnTime = 0;
      console.log('Spawned enemy'); // 添加调试日志
    }

    // 检查波次是否结束
    if (this.waveTime >= currentWave.duration / 1000) { // 转换为秒
      this.endWave();
      this.startNewWave();
    }
  }

  private startNewWave(): void {
    this.waveNumber++;
    this.waveTime = 0;
    
    this.emit('waveStart', {
      type: 'waveStart',
      data: {
        waveNumber: this.waveNumber,
        duration: this.waveDuration
      }
    });
  }

  private endWave(): void {
    this.emit('waveEnd', {
      type: 'waveEnd',
      data: {
        waveNumber: this.waveNumber,
        duration: this.waveDuration
      }
    });
  }

  public getCurrentWave(): number {
    return this.waveNumber;
  }

  public getWaveProgress(): number {
    return this.waveTime / this.waveDuration;
  }

  public getCurrentWave(time: number): WaveConfig {
    const totalTime = time - this.waveStartTime;
    let accumulatedTime = 0;

    for (let i = 0; i < WaveSystem.WAVE_CONFIGS.length; i++) {
      accumulatedTime += WaveSystem.WAVE_CONFIGS[i].duration;
      if (totalTime < accumulatedTime) {
        this.currentWaveIndex = i;
        return WaveSystem.WAVE_CONFIGS[i];
      }
    }

    // 返回最后一波
    return WaveSystem.WAVE_CONFIGS[WaveSystem.WAVE_CONFIGS.length - 1];
  }

  public getWaveProgress(time: number): number {
    const currentWave = WaveSystem.WAVE_CONFIGS[this.currentWaveIndex];
    const waveTime = time - this.waveStartTime;
    return Math.min(1, waveTime / currentWave.duration);
  }

  public isEliteSpawn(wave: WaveConfig): boolean {
    if (!wave.eliteConfig) return false;
    return Math.random() < wave.eliteConfig.chance;
  }

  public addEventListener(type: WaveEventType, listener: (event: WaveEvent) => void): void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, new Set());
    }
    this.eventListeners.get(type)?.add(listener);
  }

  public removeEventListener(type: WaveEventType, listener: (event: WaveEvent) => void): void {
    this.eventListeners.get(type)?.delete(listener);
  }

  private emitEvent(event: WaveEvent): void {
    this.eventListeners.get(event.type)?.forEach(listener => listener(event));
  }

  public getWaveState(): WaveState {
    return this.waveState;
  }

  public startWave(): void {
    this.waveState = WaveState.SPAWNING;
    this.waveStartTime = Date.now();
    this.emitEvent({
      type: 'waveStart',
      wave: this.getCurrentWave(this.waveStartTime),
      time: this.waveStartTime
    });
  }

  public completeWave(): void {
    this.waveState = WaveState.CLEARING;
    this.emitEvent({
      type: 'waveEnd',
      wave: this.getCurrentWave(Date.now()),
      time: Date.now()
    });
  }

  public clearWave(): void {
    this.waveState = WaveState.COMPLETED;
  }

  public resetWave(): void {
    this.waveState = WaveState.PREPARING;
    this.currentWaveIndex = 0;
    this.waveStartTime = 0;
  }

  private spawnEnemy(waveConfig: WaveConfig): void {
    const id = `enemy_${Date.now()}`;
    const spawnPosition = this.getRandomSpawnPosition();
    
    // 根据权重选择敌人类型
    const enemyType = this.selectEnemyType(waveConfig.enemyTypes);
    const enemyConfig = EnemyConfig[enemyType];
    
    // 计算敌人属性
    const isElite = Math.random() < (waveConfig.eliteConfig?.chance || 0);
    const stats = {
      health: enemyConfig.baseHealth * waveConfig.stats.health * (isElite ? waveConfig.eliteConfig?.statMultiplier.health || 1 : 1),
      maxHealth: enemyConfig.baseHealth * waveConfig.stats.health * (isElite ? waveConfig.eliteConfig?.statMultiplier.health || 1 : 1),
      damage: enemyConfig.baseDamage * waveConfig.stats.damage * (isElite ? waveConfig.eliteConfig?.statMultiplier.damage || 1 : 1),
      attackSpeed: enemyConfig.baseAttackSpeed,
      range: enemyConfig.baseRange,
      moveSpeed: enemyConfig.baseMoveSpeed * waveConfig.stats.speed * (isElite ? waveConfig.eliteConfig?.statMultiplier.speed || 1 : 1)
    };

    // 注册到战斗系统
    this.combatSystem.registerEntity(id, stats, spawnPosition);

    // 注册到渲染系统
    this.renderSystem.addEntity(id, {
      position: spawnPosition,
      type: 'enemy',
      color: isElite ? enemyConfig.eliteColor : enemyConfig.color,
      size: isElite ? enemyConfig.size * 1.2 : enemyConfig.size,
      health: stats.health,
      maxHealth: stats.maxHealth
    });

    // 发送精英生成事件
    if (isElite) {
      this.emit('eliteSpawn', {
        type: 'eliteSpawn',
        wave: waveConfig,
        time: Date.now()
      });
    }
  }

  private selectEnemyType(types: { type: string; weight: number }[]): EnemyType {
    const totalWeight = types.reduce((sum, type) => sum + type.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const { type, weight } of types) {
      random -= weight;
      if (random <= 0) {
        return type as EnemyType;
      }
    }
    
    return 'basic';
  }

  private getRandomSpawnPosition(): Vector2D {
    const bounds = this.renderSystem.getBounds();
    const margin = 50; // 生成区域与屏幕边缘的距离

    // 随机选择一边
    const side = Math.floor(Math.random() * 4);
    
    switch (side) {
      case 0: // 上边
        return new Vector2D(
          Math.random() * (bounds.right - bounds.left) + bounds.left,
          bounds.top - margin
        );
      case 1: // 右边
        return new Vector2D(
          bounds.right + margin,
          Math.random() * (bounds.bottom - bounds.top) + bounds.top
        );
      case 2: // 下边
        return new Vector2D(
          Math.random() * (bounds.right - bounds.left) + bounds.left,
          bounds.bottom + margin
        );
      default: // 左边
        return new Vector2D(
          bounds.left - margin,
          Math.random() * (bounds.bottom - bounds.top) + bounds.top
        );
    }
  }
} 