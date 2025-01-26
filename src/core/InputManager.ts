import { Vector2D } from '../utils/Vector2D';

export enum InputState {
  PRESSED,
  RELEASED,
  HELD
}

export interface InputSnapshot {
  moveDirection: Vector2D;
  isMoving: boolean;
  lastInputTime: number;
  inputBuffer: Set<string>;
  inputState: Map<string, InputState>;
  transitionProgress: number; // 状态过渡进度 (0-1)
  previousDirection: Vector2D; // 用于状态插值
}

export type InputEventType = 'keyDown' | 'keyUp' | 'mouseMove' | 'mouseDown' | 'mouseUp';
export type InputEventListener = (event: KeyboardEvent | MouseEvent) => void;

export class InputManager {
  private static instance: InputManager;
  private keys: Set<string> = new Set();
  private moveDirection: Vector2D = new Vector2D(0, 0);
  private eventListeners: Map<InputEventType, Set<InputEventListener>>;

  private constructor() {
    this.eventListeners = new Map();
    this.setupEventListeners();
  }

  public static getInstance(): InputManager {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager();
    }
    return InputManager.instance;
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.keys.add(event.key.toLowerCase());
    this.updateMoveDirection();
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keys.delete(event.key.toLowerCase());
    this.updateMoveDirection();
  }

  private updateMoveDirection(): void {
    let x = 0;
    let y = 0;

    // WASD 控制
    if (this.keys.has('w') || this.keys.has('arrowup')) y -= 1;
    if (this.keys.has('s') || this.keys.has('arrowdown')) y += 1;
    if (this.keys.has('a') || this.keys.has('arrowleft')) x -= 1;
    if (this.keys.has('d') || this.keys.has('arrowright')) x += 1;

    // 归一化向量，确保斜向移动速度一致
    if (x !== 0 || y !== 0) {
      const length = Math.sqrt(x * x + y * y);
      x /= length;
      y /= length;
    }

    this.moveDirection = new Vector2D(x, y);
  }

  public getMoveDirection(): Vector2D {
    return this.moveDirection;
  }

  public isKeyPressed(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  public addEventListener(type: InputEventType, listener: InputEventListener): void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, new Set());
    }
    this.eventListeners.get(type)?.add(listener);
  }

  public removeEventListener(type: InputEventType, listener: InputEventListener): void {
    this.eventListeners.get(type)?.delete(listener);
  }

  private emit(type: InputEventType, event: KeyboardEvent | MouseEvent): void {
    this.eventListeners.get(type)?.forEach(listener => listener(event));
  }

  public clearListeners(): void {
    this.eventListeners.clear();
  }

  public destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    this.clearListeners();
  }
} 