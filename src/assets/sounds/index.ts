export const MovementSounds = {
  // 行走音效
  walk: '/assets/sounds/movement/walk_normal.mp3',
  walkFast: '/assets/sounds/movement/walk_fast.mp3',
  
  // 碰撞音效
  bumpWall: '/assets/sounds/movement/bump_wall.mp3',
  bumpObject: '/assets/sounds/movement/bump_object.mp3',
  
  // 滑动音效
  slideWall: '/assets/sounds/movement/slide_wall.mp3',
  
  // 状态音效
  moveStart: '/assets/sounds/movement/move_start.mp3',
  moveStop: '/assets/sounds/movement/move_stop.mp3'
} as const;

export const UISounds = {
  click: '/assets/sounds/ui/click.mp3',
  hover: '/assets/sounds/ui/hover.mp3',
  confirm: '/assets/sounds/ui/confirm.mp3',
  cancel: '/assets/sounds/ui/cancel.mp3'
} as const;

export type MovementSoundKey = keyof typeof MovementSounds;
export type UISoundKey = keyof typeof UISounds; 