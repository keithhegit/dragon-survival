import { GameLoop } from './core/GameLoop';
import { MovementSystem } from './core/MovementSystem';
import { CombatSystem } from './core/CombatSystem';
import { WaveSystem } from './core/WaveSystem';
import { EssenceSystem } from './core/EssenceSystem';
import { LevelSystem } from './core/LevelSystem';
import { SkillSystem } from './core/SkillSystem';
import { RenderSystem } from './core/RenderSystem';
import { ExperienceUI } from './ui/ExperienceUI';
import { ExperienceSystem } from './core/ExperienceSystem';
import { GridSystem } from './core/GridSystem';
import { Vector2D } from './utils/Vector2D';
import { GameUI } from './ui/GameUI';
import { GameSystem } from './interfaces/GameSystem';
import { VirtualJoystick } from './ui/VirtualJoystick';
import { AssetLoader } from './core/AssetLoader';

class Game {
  private static instance: Game | null = null;
  private gameLoop: GameLoop;
  private experienceUI: ExperienceUI;
  private renderSystem: RenderSystem;
  private gameUI: GameUI;
  private joystick: VirtualJoystick;
  
  public static async create(): Promise<Game> {
    if (!Game.instance) {
      console.log('Game: Starting creation...');
      
      // 等待DOM完全加载
      await new Promise<void>((resolve) => {
        if (document.readyState === 'complete') {
          console.log('DOM already loaded');
          resolve();
        } else {
          console.log('Waiting for DOM to load...');
          window.addEventListener('load', () => {
            console.log('DOM load complete');
            resolve();
          });
        }
      });

      // 额外等待一帧以确保DOM更新
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      console.log('Creating game instance...');
      Game.instance = new Game();
    }
    return Game.instance;
  }

  private constructor() {
    // 1. 创建核心系统
    this.renderSystem = new RenderSystem();
    this.gameLoop = new GameLoop();
    const levelSystem = new LevelSystem();
    const experienceSystem = new ExperienceSystem(levelSystem);
    const skillSystem = new SkillSystem();
    const gridSystem = new GridSystem(32);
    const movementSystem = new MovementSystem(gridSystem);
    const combatSystem = new CombatSystem();
    const essenceSystem = new EssenceSystem(this.renderSystem, combatSystem);
    const waveSystem = new WaveSystem(this.renderSystem, combatSystem);

    // 2. 初始化UI系统
    this.gameUI = new GameUI(combatSystem, levelSystem);
    this.experienceUI = new ExperienceUI(experienceSystem, levelSystem);

    // 3. 初始化玩家实体
    const playerId = 'player';
    const playerPosition = new Vector2D(0, 0); // 放在画面中心点
    
    // 4. 注册玩家到相关系统
    combatSystem.registerEntity(playerId, {
      health: 100,
      damage: 10,
      attackSpeed: 1,
      range: 200,
      isPlayer: true,
      moveSpeed: 200 // 添加移动速度
    }, playerPosition);

    this.renderSystem.addEntity(playerId, {
      position: playerPosition,
      type: 'player',
      color: '#3498db',
      size: 20
    });

    // 5. 连接系统事件
    // 精华系统 -> 经验系统
    essenceSystem.on('collect', (event) => {
      if (event.data.expGained) {
        experienceSystem.gainExperience(event.data.expGained, `essence_${event.data.essence.type}`);
      }
    });

    // 战斗系统 -> 精华系统
    combatSystem.on('death', (event) => {
      const position = combatSystem.getEntityPosition(event.data.sourceId);
      if (position) {
        essenceSystem.spawnEssence('small', position);
      }
    });

    // 战斗系统 -> 渲染系统
    combatSystem.on('death', (event) => {
      this.renderSystem.removeEntity(event.data.sourceId);
    });

    // 创建虚拟摇杆
    this.joystick = new VirtualJoystick();

    // 6. 添加系统到游戏循环
    const systems: GameSystem[] = [
      movementSystem,
      combatSystem,
      waveSystem,
      essenceSystem,
      levelSystem,
      skillSystem,
      // 添加敌人移动系统
      {
        update: (deltaTime: number) => {
          const playerPos = movementSystem.getPosition();
          const entities = combatSystem.getEntities();
          
          for (const [id, stats] of entities.entries()) {
            if (id === 'player') continue;
            
            const enemyPos = combatSystem.getEntityPosition(id);
            if (!enemyPos || !playerPos) continue;
            
            // 敌人向玩家移动
            const direction = playerPos.subtract(enemyPos).normalize();
            const speed = stats.moveSpeed || 100;
            const newPos = enemyPos.add(direction.multiply(deltaTime * speed));
            
            // 更新敌人位置
            combatSystem.updatePosition(id, newPos);
            this.renderSystem.updateEntityPosition(id, newPos);
          }
        }
      },
      // 添加玩家移动系统
      {
        update: (deltaTime: number) => {
          // 获取摇杆方向
          const moveDirection = this.joystick.getDirection();
          const playerPos = movementSystem.getPosition();
          
          // 更新玩家位置
          if (this.joystick.isActive()) {
            const speed = 200;
            const newPos = playerPos.add(moveDirection.multiply(deltaTime * speed));
            movementSystem.setPosition(newPos);
            this.renderSystem.updateEntityPosition('player', newPos);
            // 更新朝向
            this.renderSystem.updateEntityDirection('player', moveDirection);
          }
        }
      }
    ];

    systems.forEach(system => {
      if (system && typeof system.update === 'function') {
        this.gameLoop.addSystem(system);
      }
    });

    // 7. 添加渲染和UI更新
    this.gameLoop.addSystem({
      update: (deltaTime: number) => {
        this.renderSystem.update(deltaTime);
        this.gameUI.update();
        if (this.experienceUI && typeof this.experienceUI.update === 'function') {
          this.experienceUI.update();
        }
      }
    });
  }

  public start(): void {
    try {
      const uiLayer = document.getElementById('ui-layer');
      const gameContainer = document.getElementById('game-container');
      if (!uiLayer) {
        throw new Error('UI layer not found');
      }
      
      // 显示游戏容器
      if (gameContainer) {
        gameContainer.classList.add('active');
      }
      
      // 挂载UI
      this.gameUI.mount(uiLayer);
      this.experienceUI.mount(uiLayer);
      this.joystick.mount(uiLayer);
      
      // 启动游戏循环
      this.gameLoop.start();
    } catch (error) {
      console.error('Failed to start game systems:', error);
      throw error;
    }
  }

  public stop(): void {
    this.gameLoop.stop();
    this.experienceUI.unmount();
    this.joystick.unmount();
  }
}

// 修改启动代码
async function startGame() {
  try {
    const startScreen = document.getElementById('start-screen');
    const loadingScreen = document.getElementById('loading');
    const gameContainer = document.getElementById('game-container');
    const startButton = document.getElementById('start-button');

    if (!startScreen || !loadingScreen || !gameContainer || !startButton) {
      throw new Error('Required elements not found');
    }

    // 预加载资源
    await AssetLoader.preloadAssets();

    // 等待点击开始按钮
    await new Promise<void>(resolve => {
      startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        loadingScreen.style.display = 'flex';
        resolve();
      });
    });

    // 创建并初始化游戏
    const game = await Game.create();

    // 隐藏加载界面，显示游戏界面
    loadingScreen.style.display = 'none';
    gameContainer.style.display = 'block';

    // 启动游戏
    game.start();
  } catch (error) {
    console.error('Failed to start game:', error);
  }
}

startGame(); 