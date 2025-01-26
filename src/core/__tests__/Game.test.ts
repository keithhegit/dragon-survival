import { describe, test, expect } from 'vitest';
import { Game } from '../Game';

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  test('should initialize properly', () => {
    expect(game).toBeDefined();
    expect(game['app']).toBeDefined();
    expect(game['app'].screen.width).toBe(800);
    expect(game['app'].screen.height).toBe(600);
    expect(game['gridSystem']).toBeDefined();
  });

  test('should have correct background color', () => {
    expect(game['app'].renderer.options.background).toBe(0x1099bb);
  });

  test('should handle window resize', () => {
    game['onResize']();
    expect(game['app'].renderer.width).toBe(800);
    expect(game['app'].renderer.height).toBe(600);
  });
}); 