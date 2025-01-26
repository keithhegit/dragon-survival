export class EventEmitter<T extends { type: string }> {
  private listeners: Map<T['type'], Set<(event: T) => void>> = new Map();

  public on(type: T['type'], listener: (event: T) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)?.add(listener);
  }

  public off(type: T['type'], listener: (event: T) => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  protected emit(type: T['type'], event: T): void {
    this.listeners.get(type)?.forEach(listener => listener(event));
  }
} 