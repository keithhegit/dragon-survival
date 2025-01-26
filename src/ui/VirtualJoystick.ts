import { Vector2D } from '../utils/Vector2D';

export class VirtualJoystick {
  private container: HTMLElement;
  private base: HTMLElement;
  private stick: HTMLElement;
  private baseRect: DOMRect;
  private active: boolean = false;
  private direction: Vector2D = new Vector2D(0, 0);
  private maxDistance: number = 50; // 摇杆最大移动距离

  constructor() {
    // 创建摇杆容器
    this.container = document.createElement('div');
    this.container.className = 'joystick-container';

    // 创建摇杆底座
    this.base = document.createElement('div');
    this.base.className = 'joystick-base';

    // 创建摇杆
    this.stick = document.createElement('div');
    this.stick.className = 'joystick-stick';

    // 组装
    this.base.appendChild(this.stick);
    this.container.appendChild(this.base);

    // 获取底座位置
    this.baseRect = this.base.getBoundingClientRect();

    // 绑定事件
    this.setupEvents();
  }

  private setupEvents(): void {
    // 触摸事件
    this.container.addEventListener('touchstart', this.handleStart.bind(this));
    this.container.addEventListener('touchmove', this.handleMove.bind(this));
    this.container.addEventListener('touchend', this.handleEnd.bind(this));
    this.container.addEventListener('touchcancel', this.handleEnd.bind(this));

    // 鼠标事件（用于测试）
    this.container.addEventListener('mousedown', this.handleStart.bind(this));
    document.addEventListener('mousemove', this.handleMove.bind(this));
    document.addEventListener('mouseup', this.handleEnd.bind(this));
  }

  private handleStart(e: TouchEvent | MouseEvent): void {
    this.active = true;
    this.baseRect = this.base.getBoundingClientRect();
    this.updateStickPosition(e);
  }

  private handleMove(e: TouchEvent | MouseEvent): void {
    if (!this.active) return;
    this.updateStickPosition(e);
  }

  private handleEnd(): void {
    this.active = false;
    this.direction = new Vector2D(0, 0);
    this.stick.style.transform = 'translate(0px, 0px)';
  }

  private updateStickPosition(e: TouchEvent | MouseEvent): void {
    e.preventDefault();
    
    const point = 'touches' in e ? e.touches[0] : e;
    const x = point.clientX - this.baseRect.left - this.baseRect.width / 2;
    const y = point.clientY - this.baseRect.top - this.baseRect.height / 2;

    // 计算距离和角度
    const distance = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x);

    // 限制摇杆移动范围
    const actualDistance = Math.min(distance, this.maxDistance);
    const moveX = Math.cos(angle) * actualDistance;
    const moveY = Math.sin(angle) * actualDistance;

    // 更新摇杆位置
    this.stick.style.transform = `translate(${moveX}px, ${moveY}px)`;

    // 更新方向向量（归一化）
    this.direction = new Vector2D(
      moveX / this.maxDistance,
      moveY / this.maxDistance
    );
  }

  public mount(parent: HTMLElement): void {
    parent.appendChild(this.container);
  }

  public unmount(): void {
    this.container.remove();
  }

  public getDirection(): Vector2D {
    return this.direction;
  }

  public isActive(): boolean {
    return this.active;
  }
} 