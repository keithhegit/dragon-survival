import { ExperienceSystem, ExperienceEvent } from '../core/ExperienceSystem';
import { LevelSystem, LevelEvent } from '../core/LevelSystem';

export class ExperienceUI {
  private container: HTMLElement;
  private expBar: HTMLElement;
  private expText: HTMLElement;
  private levelText: HTMLElement;
  private experienceSystem: ExperienceSystem;
  private levelSystem: LevelSystem;

  constructor(experienceSystem: ExperienceSystem, levelSystem: LevelSystem) {
    this.experienceSystem = experienceSystem;
    this.levelSystem = levelSystem;
    
    // 创建UI元素
    this.container = document.createElement('div');
    this.container.className = 'experience-ui';
    
    // 创建等级文本
    this.levelText = document.createElement('div');
    this.levelText.className = 'level-text';
    this.levelText.textContent = 'Level 1';
    
    // 创建经验文本
    this.expText = document.createElement('div');
    this.expText.className = 'exp-text';
    this.expText.textContent = '0 / 100';
    
    // 创建经验条
    this.expBar = document.createElement('div');
    this.expBar.className = 'exp-bar';
    const expFill = document.createElement('div');
    expFill.className = 'exp-fill';
    this.expBar.appendChild(expFill);
    
    // 组装UI
    this.container.appendChild(this.levelText);
    this.container.appendChild(this.expText);
    this.container.appendChild(this.expBar);

    // 设置初始状态
    this.update();
  }

  private setupListeners(): void {
    this.experienceSystem.on('expGain', this.handleExpChange.bind(this));
    this.experienceSystem.on('expLoss', this.handleExpChange.bind(this));
    this.levelSystem.on('levelUp', this.handleLevelUp.bind(this));
  }

  private handleExpChange(event: ExperienceEvent): void {
    this.update();
  }

  private handleLevelUp(event: LevelEvent): void {
    this.update();
    this.playLevelUpAnimation();
  }

  private update(): void {
    // 更新等级显示
    const currentLevel = this.levelSystem.getCurrentLevel();
    this.levelText.textContent = `Level ${currentLevel}`;

    // 更新经验值显示
    const currentExp = this.experienceSystem.getCurrentExp();
    const expToNext = this.experienceSystem.getExpToNextLevel();
    this.expText.textContent = `${currentExp} / ${expToNext}`;

    // 更新经验条
    const expPercentage = (currentExp / expToNext) * 100;
    const expFill = this.expBar.querySelector('.exp-fill') as HTMLElement;
    if (expFill) {
      expFill.style.width = `${expPercentage}%`;
    }
  }

  private playLevelUpAnimation(): void {
    this.container.classList.add('level-up');
    setTimeout(() => {
      this.container.classList.remove('level-up');
    }, 1000);
  }

  public mount(parent: HTMLElement): void {
    parent.appendChild(this.container);
  }

  public unmount(): void {
    this.container.remove();
  }
} 