export interface InputState {
  direction: {
    x: number;
    y: number;
  };
  isMoving: boolean;
}

export const DEFAULT_INPUT_STATE: InputState = {
  direction: { x: 0, y: 0 },
  isMoving: false
}; 