import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { InputManager, InputState } from '../InputManager';
import { Vector2D } from '@/utils/Vector2D';
import { vi } from 'vitest';

describe('InputManager', () => {
  let inputManager: InputManager;

  beforeEach(() => {
    inputManager = InputManager.getInstance();
  });

  afterEach(() => {
    inputManager.cleanup();
  });

  test('should handle single key press', () => {
    // 模拟按下W键
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    
    const state = inputManager.getInputState();
    expect(state.moveDirection.y).toBe(-1);
    expect(state.isMoving).toBe(true);
    expect(state.inputState.get('w')).toBe(InputState.PRESSED);
  });

  test('should handle key combinations', () => {
    // 模拟同时按下W和D键
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    
    const state = inputManager.getInputState();
    expect(state.moveDirection.length()).toBeCloseTo(1); // 标准化后的长度应为1
    expect(state.isMoving).toBe(true);
  });

  test('should handle key release', () => {
    // 按下然后释放
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }));
    
    const state = inputManager.getInputState();
    expect(state.isMoving).toBe(false);
    expect(state.inputState.get('w')).toBe(InputState.RELEASED);
  });

  test('should maintain input buffer', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    
    const state = inputManager.getInputState();
    expect(state.inputBuffer.has('w')).toBe(true);
  });

  test('should emit move events', () => {
    const moveStartSpy = vi.fn();
    const moveEndSpy = vi.fn();
    
    inputManager.addEventListener('moveStart', moveStartSpy);
    inputManager.addEventListener('moveEnd', moveEndSpy);
    
    // 测试移动开始
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    expect(moveStartSpy).toHaveBeenCalled();
    
    // 测试移动结束
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }));
    expect(moveEndSpy).toHaveBeenCalled();
  });

  test('should handle direction transitions', () => {
    vi.useFakeTimers();
    
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    const initialDirection = inputManager.getInterpolatedDirection();
    
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' }));
    
    // 检查过渡开始
    expect(inputManager.getInputState().transitionProgress).toBe(0);
    
    // 推进一半时间
    vi.advanceTimersByTime(100);
    const midDirection = inputManager.getInterpolatedDirection();
    expect(midDirection.length()).toBeCloseTo(1);
    
    vi.useRealTimers();
  });
}); 