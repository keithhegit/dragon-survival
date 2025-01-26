import { vi } from 'vitest';

// Mock PIXI
vi.mock('pixi.js', async () => {
  return {
    Application: vi.fn().mockImplementation(() => ({
      screen: {
        width: 800,
        height: 600
      },
      renderer: {
        options: {
          background: 0x1099bb
        },
        resize: vi.fn(),
        width: 800,
        height: 600
      },
      stage: {
        addChild: vi.fn()
      },
      ticker: {
        add: vi.fn()
      },
      view: document.createElement('canvas')
    })),
    Texture: {
      fromURL: vi.fn().mockImplementation(async () => ({
        width: 32,
        height: 32
      })),
    },
    Sprite: vi.fn().mockImplementation(() => ({
      anchor: {
        set: vi.fn()
      },
      x: 0,
      y: 0
    }))
  };
});

// Mock window
global.window = {
  innerWidth: 800,
  innerHeight: 600,
  devicePixelRatio: 1,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
  document: {
    createElement: (tag: string) => {
      if (tag === 'canvas') {
        return {
          getContext: () => ({
            canvas: {
              width: 800,
              height: 600
            }
          })
        };
      }
      return {};
    }
  }
} as unknown as Window & typeof globalThis;

// Mock global URL
global.URL = {
  createObjectURL: vi.fn().mockReturnValue('mock-url'),
  revokeObjectURL: vi.fn()
} as unknown as typeof URL;

// Mock Blob
global.Blob = vi.fn().mockImplementation((content) => ({
  size: content[0].length,
  type: 'image/svg+xml'
})); 