# 倔强小龙

一个基于 TypeScript 和 Canvas 开发的 2D 动作游戏。

## 游戏特点

- 竖屏设计，适合手机操作
- 虚拟摇杆控制
- 自动战斗系统
- 波次进攻模式
- 经验升级系统
- 精华收集机制

## 开发环境

- Node.js >= 14
- TypeScript 4.x
- Vite 2.x

## 项目结构

```
project/
├── src/
│   ├── assets/         # 游戏资源
│   │   └── IMG/        # 图片资源
│   ├── core/          # 核心系统
│   ├── interfaces/    # 接口定义
│   ├── utils/         # 工具类
│   ├── ui/            # UI 组件
│   └── styles/        # 样式文件
├── public/           # 静态资源
├── docs/            # 文档
└── tests/           # 测试文件
```

## 安装和运行

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建
npm run build

# 运行测试
npm test
```

## 游戏控制

- 虚拟摇杆：控制角色移动
- 自动攻击：角色会自动攻击范围内的敌人

## 开发进度

- [x] 基础游戏框架
- [x] 虚拟摇杆控制
- [x] 角色移动系统
- [x] 战斗系统
- [x] 波次系统
- [x] 经验系统
- [ ] 技能系统
- [ ] 成就系统
- [ ] 存档系统

## 贡献指南

1. Fork 本项目
2. 创建新分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License # dragon-survival
