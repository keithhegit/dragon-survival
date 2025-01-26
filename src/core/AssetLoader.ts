import { Vector2D } from '../utils/Vector2D';

export class AssetLoader {
  private static loadedAssets: Map<string, HTMLImageElement> = new Map();

  public static async loadImage(path: string): Promise<HTMLImageElement> {
    if (this.loadedAssets.has(path)) {
      return this.loadedAssets.get(path)!;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedAssets.set(path, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
      img.src = path;
    });
  }

  public static getLoadedImage(path: string): HTMLImageElement | undefined {
    return this.loadedAssets.get(path);
  }

  public static async preloadAssets(): Promise<void> {
    const assets = [
      '/src/assets/IMG/startbackground.jpg',
      '/src/assets/IMG/dragon.png'
      // 添加其他需要预加载的资源
    ];

    try {
      await Promise.all(assets.map(path => this.loadImage(path)));
      console.log('All assets loaded successfully');
    } catch (error) {
      console.error('Failed to load assets:', error);
      throw error;
    }
  }

  public static clearAssets(): void {
    this.loadedAssets.clear();
  }
} 