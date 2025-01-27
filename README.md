# 倔强小龙

一个基于 TypeScript 和 PIXI.js 开发的 2D 生存动作游戏。

## 游戏特点

- 竖屏设计，适合手机操作
- 虚拟摇杆控制
- 自动战斗系统
- 波次进攻模式
- 经验升级系统
- 精华收集机制
- 技能成长系统
- 声音系统

## 技术栈

- TypeScript 5.3
- PIXI.js 7.4
- Vite 5.0
- Vitest (单元测试)
- ESLint (代码规范)

## 核心系统

### 移动系统 (MovementSystem)
- 网格化移动
- 碰撞检测
- 平滑插值
- 虚拟摇杆控制

### 战斗系统 (CombatSystem)
- 自动攻击
- 伤害计算
- 状态效果
- 技能触发

### 波次系统 (WaveSystem)
- 敌人生成
- 难度递增
- 精英敌人
- 波次奖励

### 技能系统 (SkillSystem)
- 龙息技能树
- 被动技能
- 技能升级
- 效果叠加

### 经验系统 (ExperienceSystem)
- 经验获取
- 等级提升
- 属性成长
- 成就解锁

### 精华系统 (EssenceSystem)
- 精华掉落
- 自动吸收
- 属性加成
- 特殊效果

### 声音系统 (SoundSystem)
- 背景音乐
- 效果音效
- 音量控制
- 动态加载

### 性能优化
- 网格系统
- 对象池
- 状态管理
- 渲染优化

## 开发环境

- Node.js >= 14
- TypeScript 4.x
- Vite 2.x
- Chrome DevTools

## 项目结构与系统说明

```
src/
├── assets/                # 资源文件
│   ├── IMG/              # 图片资源
│   ├── sounds/           # 音效资源
│   └── svg/              # SVG资源
├── core/                 # 核心系统
│   ├── interfaces/       # 接口定义
│   │   ├── GameSystem.ts       # 游戏系统接口
│   │   ├── RenderSystem.ts     # 渲染系统接口
│   │   └── CombatSystem.ts     # 战斗系统接口
│   ├── __tests__/       # 单元测试
│   ├── Game.ts          # 游戏主类
│   ├── AssetLoader.ts   # 资源加载系统
│   ├── MovementSystem.ts # 移动系统
│   ├── CombatSystem.ts  # 战斗系统
│   ├── WaveSystem.ts    # 波次系统
│   ├── EssenceSystem.ts # 精华系统
│   ├── ExperienceSystem.ts # 经验系统
│   ├── LevelSystem.ts   # 等级系统
│   ├── SkillSystem.ts   # 技能系统
│   ├── SoundSystem.ts   # 声音系统
│   ├── InputManager.ts  # 输入管理
│   ├── GridSystem.ts    # 网格系统
│   ├── RenderSystem.ts  # 渲染系统
│   ├── GameCoordinator.ts # 游戏协调器
│   └── PerformanceMonitor.ts # 性能监控
├── entities/            # 游戏实体
│   ├── Dragon.ts        # 玩家角色
│   └── Enemy.ts         # 敌人实体
├── ui/                 # 界面组件
│   ├── GameUI.ts        # 游戏UI
│   ├── ExperienceUI.ts  # 经验UI
│   └── VirtualJoystick.ts # 虚拟摇杆
├── utils/              # 工具函数
│   ├── Vector2D.ts      # 二维向量
│   ├── EventEmitter.ts  # 事件发射器
│   └── ObjectPool.ts    # 对象池
├── types/              # 类型定义
│   ├── input.ts         # 输入类型
│   └── env.d.ts         # 环境声明
├── debug/              # 调试工具
│   ├── DebugConsole.ts  # 调试控制台
│   └── SpawnDebugger.ts # 生成调试器
└── styles/             # 样式文件
    ├── ui.css          # UI样式
    └── experience.css   # 经验系统样式
```

### 核心系统文件说明

#### 游戏核心 (Game.ts)
- 位置: `src/core/Game.ts`
- 职责: 游戏主循环、系统初始化、场景管理
- 依赖: PIXI.js, InputManager, AssetLoader

#### 移动系统 (MovementSystem.ts)
- 位置: `src/core/MovementSystem.ts`
- 职责: 处理实体移动、碰撞检测
- 依赖: GridSystem, Vector2D

#### 战斗系统 (CombatSystem.ts)
- 位置: `src/core/CombatSystem.ts`
- 职责: 战斗逻辑、伤害计算、状态效果
- 依赖: EventEmitter, StatSystem

#### 波次系统 (WaveSystem.ts)
- 位置: `src/core/WaveSystem.ts`
- 职责: 敌人生成、波次管理、难度调整
- 依赖: EnemySpawnSystem, EventEmitter

#### 经验系统 (ExperienceSystem.ts)
- 位置: `src/core/ExperienceSystem.ts`
- 职责: 经验获取、等级提升、属性成长
- 依赖: LevelSystem, EventEmitter

#### 精华系统 (EssenceSystem.ts)
- 位置: `src/core/EssenceSystem.ts`
- 职责: 精华生成、收集、属性加成
- 依赖: Vector2D, EventEmitter

#### 技能系统 (SkillSystem.ts)
- 位置: `src/core/SkillSystem.ts`
- 职责: 技能管理、效果计算、冷却控制
- 依赖: CooldownSystem, EventEmitter

#### 声音系统 (SoundSystem.ts)
- 位置: `src/core/SoundSystem.ts`
- 职责: 音效管理、音量控制、动态加载
- 依赖: AssetLoader

#### 输入管理 (InputManager.ts)
- 位置: `src/core/InputManager.ts`
- 职责: 处理键盘、触摸输入
- 依赖: Vector2D, EventEmitter

#### 渲染系统 (RenderSystem.ts)
- 位置: `src/core/RenderSystem.ts`
- 职责: 游戏画面渲染、动画管理
- 依赖: PIXI.js, AssetLoader

#### 性能监控 (PerformanceMonitor.ts)
- 位置: `src/core/PerformanceMonitor.ts`
- 职责: 性能数据收集、帧率监控
- 依赖: none

### 工具类文件说明

#### 向量计算 (Vector2D.ts)
- 位置: `src/utils/Vector2D.ts`
- 职责: 二维向量运算、位置计算

#### 事件系统 (EventEmitter.ts)
- 位置: `src/utils/EventEmitter.ts`
- 职责: 事件发布订阅、系统通信

#### 对象池 (ObjectPool.ts)
- 位置: `src/utils/ObjectPool.ts`
- 职责: 对象复用、内存优化

## 开发进度

### 已完成功能
- [x] 基础游戏框架
  - [x] PIXI.js 渲染系统
  - [x] 游戏循环
  - [x] 资源加载系统
  - [x] 事件系统

- [x] 移动系统
  - [x] 虚拟摇杆控制
  - [x] 网格化移动
  - [x] 碰撞检测
  - [x] 平滑移动插值

- [x] 战斗系统
  - [x] 自动战斗
  - [x] 伤害计算
  - [x] 状态效果
  - [x] 攻击范围检测

- [x] 波次系统
  - [x] 敌人生成
  - [x] 波次难度递增
  - [x] 精英敌人生成
  - [x] 波次奖励

- [x] 经验系统
  - [x] 经验获取
  - [x] 等级提升
  - [x] UI显示
  - [x] 等级提升动画

- [x] 精华系统
  - [x] 精华掉落
  - [x] 自动吸收
  - [x] 属性加成
  - [x] 吸收范围显示

- [x] 声音系统
  - [x] 背景音乐
  - [x] 效果音效
  - [x] 音量控制
  - [x] 动态音效加载

### 开发中功能
- [ ] 技能系统完善
  - [x] 基础技能框架
  - [x] 龙息技能
  - [ ] 被动技能
  - [ ] 技能升级系统

- [ ] 成就系统
  - [ ] 成就解锁条件
  - [ ] 成就奖励
  - [ ] 成就UI

- [ ] 存档系统
  - [ ] 本地存档
  - [ ] 存档加密
  - [ ] 存档备份

- [ ] 商店系统
  - [ ] 道具购买
  - [ ] 货币系统
  - [ ] 商店UI

- [ ] 多语言支持
  - [ ] 中文
  - [ ] 英文
  - [ ] 语言切换

### 待优化项目
- [ ] 性能优化
  - [ ] 对象池优化
  - [ ] 渲染优化
  - [ ] 内存管理
  
- [ ] UI优化
  - [ ] 界面美化
  - [ ] 动画效果
  - [ ] 交互优化

### 已知问题
- [ ] 音频系统需要用户交互后才能启动
- [ ] 部分浏览器的触摸事件处理问题
- [ ] 高DPI设备的缩放问题

## 调试功能

- 性能监控
- 波次调试器
- 碰撞检测可视化
- 状态监控

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 运行测试覆盖率
npm run test:coverage

# 代码检查
npm run lint

# 构建生产版本
npm run build
```

## 测试覆盖

- 单元测试
- 组件测试
- 系统集成测试
- 性能测试

## 贡献指南

1. Fork 本项目
2. 创建新分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 性能优化建议

- 使用对象池管理频繁创建/销毁的对象
- 实现网格系统进行碰撞检测优化
- 使用帧率限制和节流优化渲染性能
- 资源动态加载和释放

## 许可证

MIT License

## 系统实现详解

### 游戏初始化流程

```typescript
// Game.ts - 游戏初始化
export class Game {
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
    await AssetLoader.loadAssets();
    this.dragon = new Dragon(this.gridSystem);
    
    const gameContainer = document.getElementById('game-container');
    gameContainer?.appendChild(this.app.view as HTMLCanvasElement);
    
    this.app.stage.addChild(this.dragon.sprite);
    this.app.ticker.add(this.gameLoop.bind(this));
  }
}
```

### 核心系统实现

#### 移动系统
```typescript
// MovementSystem.ts
export class MovementSystem {
  public update(state: MovementState, delta: number): MovementState {
    if (!state.isMoving) return state;
    
    const newPosition = state.position.add(
      state.velocity.multiply(delta)
    );
    
    // 碰撞检测
    if (this.gridSystem.isWalkable(newPosition)) {
      return {
        ...state,
        position: newPosition
      };
    }
    return state;
  }
}
```

#### 战斗系统
```typescript
// CombatSystem.ts
export class CombatSystem {
  public update(deltaTime: number): void {
    this.entities.forEach((entity, id) => {
      // 寻找目标
      const target = this.findNearestTarget(entity.position);
      if (target && this.canAttack(entity)) {
        // 计算伤害
        const damage = this.calculateDamage(entity.stats, target.stats);
        this.applyDamage(target.id, damage);
        
        // 触发战斗事件
        this.emit('attack', {
          type: 'attack',
          data: { attackerId: id, targetId: target.id, damage }
        });
      }
    });
  }
}
```

#### 波次系统
```typescript
// WaveSystem.ts
export class WaveSystem {
  public update(currentTime: number): void {
    if (this.state === WaveState.SPAWNING) {
      // 生成敌人
      if (currentTime >= this.nextSpawnTime) {
        const enemy = this.spawnEnemy();
        this.emit('enemySpawn', {
          type: 'enemySpawn',
          data: { enemy }
        });
        
        // 更新下一次生成时间
        this.nextSpawnTime = currentTime + this.getSpawnInterval();
      }
      
      // 检查波次是否结束
      if (this.isWaveComplete()) {
        this.state = WaveState.COMPLETED;
        this.emit('waveComplete', {
          type: 'waveComplete',
          data: { waveNumber: this.currentWave }
        });
      }
    }
  }
}
```

#### 经验系统
```typescript
// ExperienceSystem.ts
export class ExperienceSystem {
  public gainExperience(amount: number): void {
    this.currentExp += amount;
    
    // 检查升级
    while (this.currentExp >= this.getExpToNextLevel()) {
      this.levelUp();
    }
    
    this.emit('expGain', {
      type: 'expGain',
      data: { gained: amount, total: this.currentExp }
    });
  }
}
```

#### 精华系统
```typescript
// EssenceSystem.ts
export class EssenceSystem {
  public update(playerPosition: Vector2D): void {
    this.essences.forEach((essence, id) => {
      // 检查吸收范围
      if (Vector2D.distance(essence.position, playerPosition) <= this.attractRadius) {
        // 移动精华向玩家
        const direction = playerPosition.subtract(essence.position).normalize();
        essence.position = essence.position.add(
          direction.multiply(this.attractSpeed)
        );
        
        // 检查是否被收集
        if (Vector2D.distance(essence.position, playerPosition) <= this.collectRadius) {
          this.collectEssence(id);
        }
      }
    });
  }
}
```

#### 声音系统
```typescript
// SoundSystem.ts
export class SoundSystem {
  public playSound(type: SoundType, options?: SoundOptions): void {
    const sound = this.sounds.get(type);
    if (sound) {
      sound.volume = this.masterVolume * (options?.volume ?? 1);
      sound.loop = options?.loop ?? false;
      sound.play();
    }
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = this.masterVolume;
    });
  }
}
```

### 系统交互流程

1. 游戏循环
```typescript
private gameLoop(delta: number): void {
  // 更新输入
  const input = this.inputManager.getInput();
  
  // 更新玩家
  this.dragon.update(delta, input);
  
  // 更新战斗
  this.combatSystem.update(delta);
  
  // 更新波次
  this.waveSystem.update(Date.now());
  
  // 更新精华
  this.essenceSystem.update(this.dragon.getPosition());
  
  // 更新渲染
  this.renderSystem.update(delta);
}
```

2. 事件系统
```typescript
// 战斗事件监听
combatSystem.on('attack', (event) => {
  soundSystem.playSound(SoundType.ATTACK);
  renderSystem.showDamageNumber(event.data.damage);
});

// 升级事件监听
experienceSystem.on('levelUp', (event) => {
  soundSystem.playSound(SoundType.LEVEL_UP);
  uiSystem.showLevelUpEffect(event.data.level);
});
```
