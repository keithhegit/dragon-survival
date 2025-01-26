import { Vector2D } from '../utils/Vector2D';

export interface GridCell {
  x: number;
  y: number;
  walkable: boolean;
}

export class GridSystem {
  private readonly gridSize: number;
  private cells: Map<string, GridCell>;
  
  constructor(gridSize: number) {
    this.gridSize = gridSize;
    this.cells = new Map();
  }

  /**
   * 将世界坐标转换为网格坐标
   */
  public worldToGrid(position: Vector2D): Vector2D {
    return new Vector2D(
      Math.floor(position.x / this.gridSize),
      Math.floor(position.y / this.gridSize)
    );
  }

  /**
   * 将网格坐标转换为世界坐标（居中）
   */
  public gridToWorld(gridPosition: Vector2D): Vector2D {
    return new Vector2D(
      (gridPosition.x + 0.5) * this.gridSize,
      (gridPosition.y + 0.5) * this.gridSize
    );
  }

  /**
   * 获取最近的网格中心点
   */
  public snapToGrid(position: Vector2D): Vector2D {
    const gridPos = this.worldToGrid(position);
    return this.gridToWorld(gridPos);
  }

  /**
   * 检查网格位置是否可行走
   */
  public isWalkable(position: Vector2D): boolean {
    // 临时实现：所有位置都可行走
    // TODO: 实现实际的碰撞检测
    return true;
  }

  /**
   * 设置网格单元格状态
   */
  public setCell(gridPosition: Vector2D, walkable: boolean): void {
    const key = `${gridPosition.x},${gridPosition.y}`;
    this.cells.set(key, {
      x: gridPosition.x,
      y: gridPosition.y,
      walkable
    });
  }

  /**
   * 获取相邻的可行走网格
   */
  public getNeighbors(gridPosition: Vector2D): Vector2D[] {
    const neighbors: Vector2D[] = [];
    const directions = [
      new Vector2D(1, 0),
      new Vector2D(-1, 0),
      new Vector2D(0, 1),
      new Vector2D(0, -1)
    ];

    for (const dir of directions) {
      const neighbor = gridPosition.add(dir);
      if (this.isWalkable(neighbor)) {
        neighbors.push(neighbor);
      }
    }

    return neighbors;
  }

  public getGridSize(): number {
    return this.gridSize;
  }
} 