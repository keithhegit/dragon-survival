/**
 * 二维向量工具类
 * 用于处理游戏中的位置、方向和移动计算
 */
export class Vector2D {
  constructor(
    public readonly x: number = 0,
    public readonly y: number = 0
  ) {}

  /**
   * 向量加法
   */
  public add(other: Vector2D): Vector2D {
    return new Vector2D(this.x + other.x, this.y + other.y);
  }

  /**
   * 向量减法
   */
  public subtract(other: Vector2D): Vector2D {
    return new Vector2D(this.x - other.x, this.y - other.y);
  }

  /**
   * 向量缩放
   */
  public multiply(scalar: number): Vector2D {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  /**
   * 向量标准化
   */
  public normalize(): Vector2D {
    const length = this.length();
    if (length === 0) return new Vector2D();
    return this.multiply(1 / length);
  }

  /**
   * 向量长度
   */
  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * 向量点积
   */
  public dot(v: Vector2D): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * 转换为网格坐标
   */
  public toGrid(gridSize: number): Vector2D {
    return new Vector2D(
      Math.floor(this.x / gridSize),
      Math.floor(this.y / gridSize)
    );
  }

  /**
   * 从网格坐标转换为世界坐标
   */
  public static fromGrid(gridX: number, gridY: number, gridSize: number): Vector2D {
    return new Vector2D(
      gridX * gridSize + gridSize / 2,
      gridY * gridSize + gridSize / 2
    );
  }

  /**
   * 克隆向量
   */
  public clone(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  /**
   * 线性插值到目标向量
   * @param target 目标向量
   * @param t 插值参数 (0-1)
   * @returns 插值后的新向量
   */
  public lerp(target: Vector2D, t: number): Vector2D {
    const clampedT = Math.max(0, Math.min(1, t));
    return new Vector2D(
      this.x + (target.x - this.x) * clampedT,
      this.y + (target.y - this.y) * clampedT
    );
  }

  /**
   * 判断两个向量是否相等
   */
  public equals(other: Vector2D): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }

  public static distance(a: Vector2D, b: Vector2D): number {
    return a.subtract(b).length();
  }
} 