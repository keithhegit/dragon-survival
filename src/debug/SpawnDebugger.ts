import { WaveSystem } from '../core/WaveSystem';
import { EnemySpawnSystem } from '../core/EnemySpawnSystem';

export class SpawnDebugger {
  private static instance: SpawnDebugger;
  private debugElement: HTMLElement;
  private visible: boolean = false;

  private constructor() {
    this.debugElement = document.createElement('div');
    this.debugElement.style.position = 'fixed';
    this.debugElement.style.top = '10px';
    this.debugElement.style.right = '10px';
    this.debugElement.style.backgroundColor = 'rgba(0,0,0,0.7)';
    this.debugElement.style.color = 'white';
    this.debugElement.style.padding = '10px';
    document.body.appendChild(this.debugElement);
  }

  public static getInstance(): SpawnDebugger {
    if (!SpawnDebugger.instance) {
      SpawnDebugger.instance = new SpawnDebugger();
    }
    return SpawnDebugger.instance;
  }

  public updateStats(waveSystem: WaveSystem, spawnSystem: EnemySpawnSystem): void {
    const currentWave = waveSystem.getCurrentWave(Date.now());
    const progress = waveSystem.getWaveProgress(Date.now());
    
    this.debugElement.innerHTML = `
      <h3>Wave Debug Info</h3>
      <p>Wave: ${currentWave.waveNumber}</p>
      <p>Progress: ${(progress * 100).toFixed(1)}%</p>
      <p>State: ${waveSystem.getWaveState()}</p>
      <p>Enemy Count: ${spawnSystem.getActiveEnemyCount()}</p>
      <p>Pool Size: ${spawnSystem.getPoolSize()}</p>
    `;
  }

  public toggle(): void {
    this.visible = !this.visible;
    this.debugElement.style.display = this.visible ? 'block' : 'none';
  }
} 