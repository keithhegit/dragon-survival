class MockTexture {
  width: number = 0;
  height: number = 0;
  private listeners = new Map<string, () => void>();

  once(event: string, callback: () => void) {
    this.listeners.set(event, callback);
    // 模拟纹理加载完成
    setTimeout(() => callback(), 10);
  }
}

export { MockTexture }; 