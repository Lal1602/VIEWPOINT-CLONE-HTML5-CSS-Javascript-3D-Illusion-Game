import * as THREE from 'three';

export type BlockType = 'platform' | 'start' | 'goal' | 'deco' | 'danger';
export type BlockFace = 'right' | 'left' | 'top' | 'bottom' | 'front' | 'back';

export interface BlockData {
  x: number;
  y: number;
  z: number;
  type: BlockType;
  dangerFaces?: BlockFace[]; // Array of faces that are red/blocked
}

export interface LevelData {
  id: number;
  name: string;
  description: string;
  blocks: BlockData[];
  startPos: [number, number, number];
  goalPos: [number, number, number];
  camStartAngle?: number; // In radians
}

export interface GameState {
  currentLevelIndex: number;
  isMoving: boolean;
  isRotating: boolean;
  score: number;
}
