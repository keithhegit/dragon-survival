import * as PIXI from 'pixi.js';
import { Dragon } from '@/entities/Dragon';
import { InputManager } from './InputManager';
import { AssetLoader } from './AssetLoader';
import { GridSystem } from './GridSystem';

export class Game {
  private app: PIXI.Application;
  private dragon: Dragon;
  private inputManager: InputManager;
  private gridSystem: GridSystem;

  constructor() {
    this.gridSystem = new GridSystem(32);
    this.app = new PIXI.Application({
      width: window?.innerWidth || 800,
      height: window?.innerHeight || 600,
      backgroundColor: 0x1099bb,
      resolution: window?.devicePixelRatio || 1,
    });

    this.inputManager = new InputManager();
  }

  public async start(): Promise<void> {
    // 加载资源
    await AssetLoader.loadAssets();
    
    // 创建小龙实例
    this.dragon = new Dragon(this.gridSystem);

    document.getElementById('app')?.appendChild(this.app.view as HTMLCanvasElement);
    
    this.app.stage.addChild(this.dragon.sprite);
    
    // 居中显示小龙
    this.dragon.sprite.x = this.app.screen.width / 2;
    this.dragon.sprite.y = this.app.screen.height / 2;

    // 启动游戏循环
    this.app.ticker.add(this.gameLoop.bind(this));
    
    // 监听窗口大小变化
    window?.addEventListener('resize', this.onResize.bind(this));
  }

  private gameLoop(delta: number): void {
    this.dragon.update(delta, this.inputManager.getInput());
  }

  private onResize(): void {
    this.app.renderer.resize(window?.innerWidth || 800, window?.innerHeight || 600);
  }
} 