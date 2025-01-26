import { describe, test, expect, beforeEach, vi } from 'vitest';
import { AssetLoader } from '@/core/AssetLoader';
import { SVGAssets } from '@/assets/svg';
import * as PIXI from 'pixi.js';

// 使用 hoisted 定义模拟类
const MockTexture = vi.hoisted(() => {
  class MockTexture {
    width = 0;
    height = 0;
    
    constructor() {
      // 延迟设置尺寸模拟真实加载流程
      this.once('update', () => {
        this.width = 64;
        this.height = 64;
      });
    }

    once(event: string, callback: () => void) {
      setTimeout(callback, 10);
    }
  }
  
  return {
    from: vi.fn((url: string) => Promise.resolve(new MockTexture()))
  };
});

// 在文件顶部正确模拟 PIXI.js
vi.mock('pixi.js', () => ({
  Texture: MockTexture
}));

describe('AssetLoader', () => {
  beforeEach(() => {
    // 清理纹理缓存
    (AssetLoader as any).textures = new Map();
  });

  test('should load all SVG assets', async () => {
    await AssetLoader.loadAssets();
    expect(AssetLoader.getTexture('dragon')).toBeDefined();
  });

  test('should throw error for invalid texture key', () => {
    expect(() => AssetLoader.getTexture('invalid')).toThrow('Texture invalid not found');
  });

  test('should have correct texture dimensions', async () => {
    // 使用虚拟定时器
    vi.useFakeTimers();
    
    await AssetLoader.loadAssets();
    
    // 推进所有定时器
    vi.advanceTimersByTime(20);
    
    const texture = AssetLoader.getTexture('dragon');
    expect(texture.width).toBe(64);
    expect(texture.height).toBe(64);
    
    // 恢复真实定时器
    vi.useRealTimers();
  });
}); 