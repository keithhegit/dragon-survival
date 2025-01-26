import { CombatSystem } from '../core/CombatSystem';
import { LevelSystem } from '../core/LevelSystem';

export class GameUI {
  private container: HTMLDivElement;
  private hpBar: HTMLDivElement;
  private levelInfo: HTMLDivElement;
  private timer: HTMLDivElement;
  private volumeControl: HTMLDivElement;

  private gameStartTime: number = 0;
  private gameTime: number = 0;

  constructor(
    private combatSystem: CombatSystem,
    private levelSystem: LevelSystem
  ) {
    this.createUI();
    this.gameStartTime = Date.now();
  }

  private createUI(): void {
    // 创建主容器
    this.container = document.createElement('div');
    this.container.className = 'game-ui';

    // 创建HP条
    this.hpBar = this.createHPBar();
    this.container.appendChild(this.hpBar);

    // 创建等级和时间信息
    const centerInfo = this.createCenterInfo();
    this.container.appendChild(centerInfo);

    // 创建音量控制
    this.volumeControl = this.createVolumeControl();
    this.container.appendChild(this.volumeControl);
  }

  private createHPBar(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'hp-container';

    const label = document.createElement('div');
    label.className = 'hp-label';
    label.textContent = 'HP: 50';

    const bar = document.createElement('div');
    bar.className = 'hp-bar';
    
    const fill = document.createElement('div');
    fill.className = 'hp-fill';
    bar.appendChild(fill);

    container.appendChild(label);
    container.appendChild(bar);

    return container;
  }

  private createCenterInfo(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'center-info';

    this.timer = document.createElement('div');
    this.timer.className = 'timer';
    this.timer.textContent = '00:18';

    this.levelInfo = document.createElement('div');
    this.levelInfo.className = 'level-info';
    this.levelInfo.textContent = 'Level 1';

    container.appendChild(this.timer);
    container.appendChild(this.levelInfo);

    return container;
  }

  private createVolumeControl(): HTMLDivElement {
    const container = document.createElement('div');
    container.className = 'volume-control';

    const icon = document.createElement('div');
    icon.className = 'volume-icon';
    icon.innerHTML = '🔊';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.value = '50';
    slider.className = 'volume-slider';

    container.appendChild(icon);
    container.appendChild(slider);

    return container;
  }

  public mount(parent: HTMLElement): void {
    parent.appendChild(this.container);
  }

  public unmount(): void {
    this.container.remove();
  }

  public update(): void {
    // 更新游戏时间
    this.gameTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
    const minutes = Math.floor(this.gameTime / 60);
    const seconds = this.gameTime % 60;
    this.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // 更新HP显示
    const playerStats = this.combatSystem.getEntityStats('player');
    if (playerStats) {
      const hpFill = this.hpBar.querySelector('.hp-fill') as HTMLDivElement;
      const hpLabel = this.hpBar.querySelector('.hp-label') as HTMLDivElement;
      
      const hpPercent = (playerStats.health / 100) * 100;
      hpFill.style.width = `${hpPercent}%`;
      hpLabel.textContent = `HP: ${playerStats.health}`;
    }

    // 更新等级显示
    this.levelInfo.textContent = `Level ${this.levelSystem.getCurrentLevel()}`;
  }
} 