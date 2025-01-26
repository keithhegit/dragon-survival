import { EventEmitter } from '@/utils/EventEmitter';

export type CooldownEventType = 'start' | 'end' | 'update';

export interface CooldownEvent {
  type: CooldownEventType;
  data: {
    skillId: string;
    remainingTime?: number;
    totalTime?: number;
  };
}

export class CooldownSystem extends EventEmitter<CooldownEvent> {
  private cooldowns: Map<string, number> = new Map(); // skillId -> endTime
  private durations: Map<string, number> = new Map(); // skillId -> duration

  public startCooldown(skillId: string, duration: number): void {
    const now = Date.now();
    this.cooldowns.set(skillId, now + duration);
    this.durations.set(skillId, duration);

    this.emit('start', {
      type: 'start',
      data: {
        skillId,
        remainingTime: duration,
        totalTime: duration
      }
    });
  }

  public isOnCooldown(skillId: string): boolean {
    const endTime = this.cooldowns.get(skillId);
    if (!endTime) return false;
    return Date.now() < endTime;
  }

  public getRemainingTime(skillId: string): number {
    const endTime = this.cooldowns.get(skillId);
    if (!endTime) return 0;
    return Math.max(0, endTime - Date.now());
  }

  public getCooldownProgress(skillId: string): number {
    const remainingTime = this.getRemainingTime(skillId);
    const duration = this.durations.get(skillId) || 0;
    if (duration === 0) return 1;
    return 1 - (remainingTime / duration);
  }

  public update(): void {
    const now = Date.now();
    this.cooldowns.forEach((endTime, skillId) => {
      if (now >= endTime) {
        this.cooldowns.delete(skillId);
        this.durations.delete(skillId);
        this.emit('end', {
          type: 'end',
          data: { skillId }
        });
      } else {
        this.emit('update', {
          type: 'update',
          data: {
            skillId,
            remainingTime: endTime - now,
            totalTime: this.durations.get(skillId)
          }
        });
      }
    });
  }

  public reduceCooldown(skillId: string, amount: number): void {
    const endTime = this.cooldowns.get(skillId);
    if (!endTime) return;
    this.cooldowns.set(skillId, endTime - amount);
  }

  public resetCooldown(skillId: string): void {
    this.cooldowns.delete(skillId);
    this.durations.delete(skillId);
  }

  public resetAllCooldowns(): void {
    this.cooldowns.clear();
    this.durations.clear();
  }
} 