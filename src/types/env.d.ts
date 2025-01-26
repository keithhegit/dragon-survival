/// <reference types="vite/client" />
/// <reference types="vitest" />

declare module 'pixi.js' {
  export * from '@pixi/core';
  export * from '@pixi/app';
  export * from '@pixi/sprite';
  export * from '@pixi/display';
  export * from '@pixi/graphics';
  
  import * as PIXI from 'pixi.js';
  export default PIXI;
}

declare module 'vitest' {
  export * from 'vitest/dist/index';
} 