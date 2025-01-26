import { describe, test, expect } from 'vitest';
import { GridSystem } from '../GridSystem';
import { Vector2D } from '@/utils/Vector2D';

describe('GridSystem', () => {
  let gridSystem: GridSystem;

  beforeEach(() => {
    gridSystem = new GridSystem(32);
  });

  test('should convert world to grid coordinates', () => {
    const worldPos = new Vector2D(50, 70);
    const gridPos = gridSystem.worldToGrid(worldPos);
    expect(gridPos.x).toBe(1);
    expect(gridPos.y).toBe(2);
  });

  test('should convert grid to world coordinates', () => {
    const gridPos = new Vector2D(1, 2);
    const worldPos = gridSystem.gridToWorld(gridPos);
    expect(worldPos.x).toBe(48); // 1 * 32 + 16
    expect(worldPos.y).toBe(80); // 2 * 32 + 16
  });

  test('should snap position to grid', () => {
    const gridSystem = new GridSystem(32);
    
    // 测试点 (50,70) -> 网格索引(1,2)
    const position = new Vector2D(50, 70);
    const snapped = gridSystem.snapToGrid(position);
    
    // 网格中心应为 (1*32+16, 2*32+16) = (48, 80)
    expect(snapped.x).toBe(48);
    expect(snapped.y).toBe(80);
  });

  test('should handle walkable cells', () => {
    const pos = new Vector2D(1, 1);
    expect(gridSystem.isWalkable(pos)).toBe(true); // Default walkable
    
    gridSystem.setCell(pos, false);
    expect(gridSystem.isWalkable(pos)).toBe(false);
  });

  test('should get walkable neighbors', () => {
    const center = new Vector2D(1, 1);
    gridSystem.setCell(new Vector2D(1, 0), false); // Block north
    
    const neighbors = gridSystem.getNeighbors(center);
    expect(neighbors.length).toBe(3); // Should have 3 walkable neighbors
  });

  test('should snap to correct grid center', () => {
    const gridSystem = new GridSystem(32);
    
    // 测试点 (31.9,31.9) -> 网格索引(0,0)
    const pos = new Vector2D(31.9, 31.9);
    const snapped = gridSystem.snapToGrid(pos);
    
    // 中心坐标应为 (0*32+16, 0*32+16) = (16,16)
    expect(snapped.x).toBe(16);
    expect(snapped.y).toBe(16);
    
    // 测试点 (32.1,32.1) -> 网格索引(1,1)
    const pos2 = new Vector2D(32.1, 32.1);
    const snapped2 = gridSystem.snapToGrid(pos2);
    
    // 中心坐标应为 (1*32+16, 1*32+16) = (48,48)
    expect(snapped2.x).toBe(48);
    expect(snapped2.y).toBe(48);
  });
}); 