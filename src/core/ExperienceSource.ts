export enum ExperienceSourceType {
  KILL = 'kill',
  QUEST = 'quest',
  ITEM = 'item',
  EXPLORATION = 'exploration',
  ACHIEVEMENT = 'achievement'
}

export interface ExperienceSource {
  type: ExperienceSourceType;
  id: string;
  baseExp: number;
  multiplier?: number;
  levelRequirement?: number;
  cooldown?: number; // 经验获取冷却（毫秒）
  maxTimesPerDay?: number; // 每日获取上限次数
}

export const EXPERIENCE_SOURCES: Record<string, ExperienceSource> = {
  // 击杀经验
  'kill_normal': {
    type: ExperienceSourceType.KILL,
    id: 'kill_normal',
    baseExp: 10,
    multiplier: 1.0
  },
  'kill_elite': {
    type: ExperienceSourceType.KILL,
    id: 'kill_elite',
    baseExp: 50,
    multiplier: 1.2
  },
  'kill_boss': {
    type: ExperienceSourceType.KILL,
    id: 'kill_boss',
    baseExp: 200,
    multiplier: 1.5,
    cooldown: 3600000 // 1小时
  },

  // 任务经验
  'quest_daily': {
    type: ExperienceSourceType.QUEST,
    id: 'quest_daily',
    baseExp: 100,
    maxTimesPerDay: 5
  },
  'quest_weekly': {
    type: ExperienceSourceType.QUEST,
    id: 'quest_weekly',
    baseExp: 500,
    maxTimesPerDay: 1
  },

  // 探索经验
  'explore_newarea': {
    type: ExperienceSourceType.EXPLORATION,
    id: 'explore_newarea',
    baseExp: 150,
    levelRequirement: 5
  }
};

export class ExperienceSourceManager {
  private lastGainTime: Map<string, number> = new Map();
  private dailyGainCount: Map<string, number> = new Map();
  private lastDayReset: number = Date.now();

  constructor() {
    this.checkDayReset();
  }

  public canGainExperience(sourceId: string, playerLevel: number): boolean {
    const source = EXPERIENCE_SOURCES[sourceId];
    if (!source) return false;

    // 检查等级要求
    if (source.levelRequirement && playerLevel < source.levelRequirement) {
      return false;
    }

    // 检查冷却
    if (source.cooldown) {
      const lastTime = this.lastGainTime.get(sourceId) || 0;
      if (Date.now() - lastTime < source.cooldown) {
        return false;
      }
    }

    // 检查每日上限
    if (source.maxTimesPerDay) {
      const count = this.dailyGainCount.get(sourceId) || 0;
      if (count >= source.maxTimesPerDay) {
        return false;
      }
    }

    return true;
  }

  public calculateExperience(sourceId: string, level: number): number {
    const source = EXPERIENCE_SOURCES[sourceId];
    if (!source) return 0;

    let exp = source.baseExp;
    
    // 应用等级缩放
    if (source.type === ExperienceSourceType.KILL) {
      exp *= Math.max(0.1, 1 - Math.max(0, level - 10) * 0.1); // 等级差距每10级降低10%
    }

    // 应用来源倍率
    if (source.multiplier) {
      exp *= source.multiplier;
    }

    return Math.round(exp);
  }

  public recordExperienceGain(sourceId: string): void {
    this.checkDayReset();

    const source = EXPERIENCE_SOURCES[sourceId];
    if (!source) return;

    // 记录获取时间
    this.lastGainTime.set(sourceId, Date.now());

    // 记录每日次数
    if (source.maxTimesPerDay) {
      const count = this.dailyGainCount.get(sourceId) || 0;
      this.dailyGainCount.set(sourceId, count + 1);
    }
  }

  private checkDayReset(): void {
    const now = Date.now();
    const dayStart = new Date().setHours(0, 0, 0, 0);

    if (this.lastDayReset < dayStart) {
      this.dailyGainCount.clear();
      this.lastDayReset = now;
    }
  }
} 