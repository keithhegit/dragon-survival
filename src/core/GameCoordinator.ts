import { MovementSystem } from './MovementSystem';
import { CombatSystem } from './CombatSystem';
import { EnemySpawnSystem } from './EnemySpawnSystem';
import { WaveSystem, WaveConfig } from './WaveSystem';
import { Target } from './CombatSystem';

export class GameCoordinator {
  private movementSystem: MovementSystem;
  private combatSystem: CombatSystem;
  private spawnSystem: EnemySpawnSystem;
  private waveSystem: WaveSystem;

  constructor() {
    this.movementSystem = new MovementSystem(32); // 网格大小32
    this.combatSystem = new CombatSystem();
    this.spawnSystem = new EnemySpawnSystem();
    this.waveSystem = new WaveSystem();

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // 战斗系统监听敌人死亡
    this.combatSystem.addEventListener('targetDeath', (target: Target) => {
      // 通知波次系统
      this.waveSystem.onEnemyDeath(target.id);
    });

    // 波次系统监听波次开始
    this.waveSystem.addEventListener('waveStart', (event: { wave: WaveConfig }) => {
      // 重置生成系统
      this.spawnSystem.resetForNewWave(event.wave);
    });
  }

  public update(deltaTime: number): void {
    // 更新顺序：移动->战斗->生成
    this.movementSystem.update(deltaTime);
    this.combatSystem.update(deltaTime);
    
    const wave = this.waveSystem.getCurrentWave(Date.now());
    this.spawnSystem.update(wave, this.movementSystem.getPlayerPosition());
  }
} 