import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { ExperienceUI } from '../ExperienceUI';
import { ExperienceSystem } from '../../core/ExperienceSystem';
import { LevelSystem } from '../../core/LevelSystem';

describe('ExperienceUI', () => {
  let expUI: ExperienceUI;
  let expSystem: ExperienceSystem;
  let levelSystem: LevelSystem;
  let container: HTMLElement;

  beforeEach(() => {
    // 创建DOM环境
    container = document.createElement('div');
    document.body.appendChild(container);

    // 初始化系统
    levelSystem = new LevelSystem();
    expSystem = new ExperienceSystem(levelSystem);
    expUI = new ExperienceUI(expSystem, levelSystem);

    // 挂载UI
    expUI.mount(container);
  });

  afterEach(() => {
    container.remove();
  });

  test('should create UI elements correctly', () => {
    expect(container.querySelector('.exp-bar')).toBeTruthy();
    expect(container.querySelector('.exp-text')).toBeTruthy();
    expect(container.querySelector('.level-text')).toBeTruthy();
  });

  test('should update UI on experience gain', () => {
    vi.spyOn(expSystem, 'getCurrentExp').mockReturnValue(50);
    vi.spyOn(expSystem, 'getExpToNextLevel').mockReturnValue(100);
    vi.spyOn(expSystem, 'getExpProgress').mockReturnValue(0.5);
    vi.spyOn(levelSystem, 'getCurrentLevel').mockReturnValue(1);

    expSystem.gainExperience(50);

    const expText = container.querySelector('.exp-text');
    const expBar = container.querySelector('.exp-bar') as HTMLElement;
    
    expect(expText?.textContent).toBe('50 / 100');
    expect(expBar.style.width).toBe('50%');
  });

  test('should show level up animation', () => {
    levelSystem.addExperience(100); // 触发升级

    const container = document.querySelector('.exp-container');
    expect(container?.classList.contains('level-up')).toBe(true);

    // 等待动画结束
    vi.advanceTimersByTime(1000);
    expect(container?.classList.contains('level-up')).toBe(false);
  });

  test('should clean up listeners on unmount', () => {
    const expGainSpy = vi.spyOn(expSystem, 'on');
    const levelUpSpy = vi.spyOn(levelSystem, 'on');

    expUI.unmount();

    // 验证事件监听器被移除
    expect(expGainSpy).toHaveBeenCalledWith('expGain', expect.any(Function));
    expect(levelUpSpy).toHaveBeenCalledWith('levelUp', expect.any(Function));
  });

  test('should handle experience loss', () => {
    vi.spyOn(expSystem, 'getCurrentExp').mockReturnValue(50);
    vi.spyOn(expSystem, 'getExpToNextLevel').mockReturnValue(100);
    vi.spyOn(expSystem, 'getExpProgress').mockReturnValue(0.5);

    expSystem.loseExperience(25);

    const expText = container.querySelector('.exp-text');
    expect(expText?.textContent).toBe('50 / 100');
  });
}); 