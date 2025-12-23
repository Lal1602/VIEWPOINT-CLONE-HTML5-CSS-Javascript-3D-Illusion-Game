import { LevelData } from './types';

export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: "First Steps",
    description: "Rotate until the gap disappears.",
    startPos: [0, 0, 0],
    goalPos: [0, 0, -4],
    blocks: [
      { x: 0, y: 0, z: 0, type: 'start' },
      { x: 0, y: 0, z: -1, type: 'platform' },
      { x: 2, y: 0, z: -2, type: 'platform' }, // Gap Filler
      { x: 0, y: 0, z: -3, type: 'platform' },
      { x: 0, y: 0, z: -4, type: 'goal' },
    ]
  },
  {
    id: 2,
    name: "Bird's Eye View",
    description: "Switch to Top View to walk across heights.",
    startPos: [0, 0, 0],
    goalPos: [3, 4, 0],
    blocks: [
      { x: 0, y: 0, z: 0, type: 'start' },
      { x: 1, y: 0, z: 0, type: 'platform' },
      { x: 2, y: 2, z: 0, type: 'platform' }, // Height Illusion
      { x: 3, y: 4, z: 0, type: 'goal' },
      { x: 2, y: 0, z: 2, type: 'deco' },
    ]
  },
  {
    id: 3,
    name: "The Invisible Staircase",
    description: "In Top View, height is meaningless.",
    startPos: [0, 0, 0],
    goalPos: [1, 6, 2],
    blocks: [
      { x: 0, y: 0, z: 0, type: 'start' },
      { x: 1, y: 0, z: 0, type: 'platform' },
      { x: 1, y: 2, z: 1, type: 'platform' }, // Visual jump Y
      { x: 0, y: 2, z: 1, type: 'platform' },
      { x: 0, y: 4, z: 2, type: 'platform' }, // Visual jump Y
      { x: 1, y: 6, z: 2, type: 'goal' },
      { x: 2, y: 0, z: 2, type: 'deco' },
    ]
  },
  {
    id: 4,
    name: "The Occlusion Bridge",
    description: "Use the floating pillar to bridge the gap.",
    startPos: [-2, 0, 0],
    goalPos: [2, 0, 0],
    blocks: [
      { x: -2, y: 0, z: 0, type: 'start' },
      { x: -1, y: 0, z: 0, type: 'platform' },
      { x: 0, y: 3, z: 0, type: 'platform' }, // High Pillar
      { x: 1, y: 0, z: 0, type: 'platform' },
      { x: 2, y: 0, z: 0, type: 'goal' },
      { x: 0, y: -2, z: 2, type: 'deco' },
    ]
  },
  {
    id: 5,
    name: "Skyline",
    description: "Leap between skyscrapers using every angle.",
    startPos: [0, 0, 0],
    goalPos: [4, 0, -4],
    blocks: [
      { x: 0, y: 0, z: 0, type: 'start' },
      { x: 1, y: 0, z: 0, type: 'platform' },
      { x: 2, y: 3, z: 0, type: 'platform' },
      { x: 2, y: 0, z: 0, type: 'deco' },
      { x: 2, y: 1, z: 0, type: 'deco' },
      { x: 2, y: 2, z: 0, type: 'deco' },
      { x: 3, y: 3, z: -4, type: 'platform' },
      { x: 3, y: 0, z: -4, type: 'deco' },
      { x: 3, y: 1, z: -4, type: 'deco' },
      { x: 3, y: 2, z: -4, type: 'deco' },
      { x: 4, y: 0, z: -4, type: 'goal' },
    ]
  },
  {
    id: 6,
    name: "The Weave",
    description: "Thread the needle through dimensions.",
    startPos: [-2, 0, 2],
    goalPos: [2, 0, 2],
    blocks: [
      { x: -2, y: 0, z: 2, type: 'start' },
      { x: -1, y: 0, z: 2, type: 'deco' }, 
      { x: -1, y: 3, z: 2, type: 'platform' },
      { x: 0, y: 3, z: -2, type: 'platform' },
      { x: 1, y: 0, z: -2, type: 'platform' },
      { x: 2, y: 0, z: 2, type: 'goal' },
    ]
  },
  {
    id: 7,
    name: "The Grand Staircase",
    description: "A spiral that only connects in pieces.",
    startPos: [0, 0, 0],
    goalPos: [6, 0, 0],
    blocks: [
      { x: 0, y: 0, z: 0, type: 'start' },
      { x: 1, y: 0, z: 0, type: 'platform' },
      { x: 2, y: 2, z: 0, type: 'platform' },
      { x: 2, y: 0, z: 0, type: 'deco' },
      { x: 3, y: 2, z: -2, type: 'platform' },
      { x: 3, y: 0, z: -2, type: 'deco' },
      { x: 4, y: 4, z: -2, type: 'platform' },
      { x: 4, y: 0, z: -2, type: 'deco' },
      { x: 4, y: 2, z: -2, type: 'deco' },
      { x: 5, y: 4, z: 0, type: 'platform' },
      { x: 5, y: 0, z: 0, type: 'deco' },
      { x: 5, y: 2, z: 0, type: 'deco' },
      { x: 6, y: 0, z: 0, type: 'goal' },
    ]
  },
  {
    id: 8,
    name: "Dark Matter",
    description: "Black blocks are voids. Filter them out visually.",
    startPos: [0, 0, 4],
    goalPos: [2, 4, -1],
    blocks: [
      { x: 0, y: 0, z: 4, type: 'start' },
      { x: 0, y: 0, z: 3, type: 'platform' },
      { x: 1, y: 0, z: 3, type: 'deco' }, 
      { x: 0, y: 4, z: 2, type: 'platform' },
      { x: 0, y: 2, z: 2, type: 'deco' },
      { x: 1, y: 4, z: -1, type: 'platform' },
      { x: 0, y: 4, z: 0, type: 'deco' },
      { x: 1, y: 0, z: -2, type: 'platform' },
      { x: 1, y: 2, z: -2, type: 'deco' }, 
      { x: 2, y: 0, z: 1, type: 'platform' },
      { x: 2, y: 0, z: -1, type: 'deco' }, 
      { x: 2, y: 4, z: 0, type: 'platform' },
      { x: 2, y: 4, z: -1, type: 'goal' },
    ]
  },
  {
    id: 9,
    name: "Crimson Separation",
    description: "Red faces are repelling magnets. Find the neutral angle.",
    startPos: [0, 0, 0],
    goalPos: [0, 5, 1], // New Goal Position to avoid stacking on Start(0,0,0)
    blocks: [
      { x: 0, y: 0, z: 0, type: 'start' },

      // 1. Move East (X+1)
      // Coords: (1, 0, 0). Unique.
      // Constraint: Front Face is Red. 
      // Solution: Rotate to Top View or Back/Side.
      { 
        x: 1, y: 0, z: 0, 
        type: 'platform', 
        dangerFaces: ['front'] 
      },

      // 2. Ascend to Deep Space (Top View)
      // From (1,0,0) to (1,3,-2).
      // Coords: (1, -2). Unique.
      // Constraint: Right Face is Red.
      // Solution: Stay in Top View or look from Front/Back.
      { 
        x: 1, y: 3, z: -2, 
        type: 'platform',
        dangerFaces: ['right']
      },

      // 3. The Lateral Shift (Side View)
      // From (1,3,-2) to (0,3,-2).
      // Coords: (0, -2). Unique.
      // Constraint: TOP Face is Red.
      // Solution: YOU MUST USE SIDE VIEW. Top view is blocked.
      { 
        x: 0, y: 3, z: -2, 
        type: 'platform',
        dangerFaces: ['top']
      },

      // 4. Goal
      // From (0,3,-2) to (0,5,1).
      // Coords: (0, 1). Unique.
      // No Vertical Stacking: (0,0) start vs (0,1) goal. Safe.
      { x: 0, y: 5, z: 1, type: 'goal', dangerFaces: ['front'] },
      
      // Decos (Safe Coordinates)
      { x: 2, y: -2, z: 2, type: 'deco' },
      { x: -1, y: 2, z: -3, type: 'deco' }
    ]
  },
  {
    id: 10,
    name: "The Mind's Eye",
    description: "A fragmented reality. Every step requires a new perspective. No shortcuts.",
    startPos: [-1, -1, 3], 
    goalPos: [2, 3, -2],
    blocks: [
      { x: -1, y: -1, z: 3, type: 'start' },

      // --- ISLAND 1: The Base ---
      
      // Step 1: Move to (-1, -1, 1). 
      // Simple movement along Z.
      // Block has RED TOP. (Must use Side View).
      { 
        x: -1, y: -1, z: 1, 
        type: 'platform',
        dangerFaces: ['top']
      },

      // Step 2: Move to (1, -1, 1).
      // Simple movement along X.
      // Block has RED FRONT. (Must use Back/Top View).
      { 
        x: 1, y: -1, z: 1, 
        type: 'platform',
        dangerFaces: ['front']
      },

      // --- ISLAND 2: The Float (No vertical stacking above Island 1) ---

      // Step 3: PERSPECTIVE JUMP UP (Top View)
      // Jump from (1, -1, 1) to (1, 1, 0).
      // Top View Delta: Z (1 -> 0). Valid.
      // Y changes -1 -> 1.
      // Block has RED RIGHT. (Must use Top/Front View).
      { 
        x: 1, y: 1, z: 0, 
        type: 'platform',
        dangerFaces: ['right']
      },

      // Step 4: PERSPECTIVE JUMP DEPTH (Side View)
      // Jump from (1, 1, 0) to (0, 1, -2).
      // Side View Delta: X (1 -> 0). Valid.
      // Z changes 0 -> -2.
      // Block has RED BOTTOM. (Must use Top View? No Top sees Bottom? No Top sees Top).
      // If we are in Side View, we see Side.
      // Let's put RED TOP.
      // Must use Side View to step on it.
      { 
        x: 0, y: 1, z: -2, 
        type: 'platform',
        dangerFaces: ['top']
      },

      // --- ISLAND 3: The Ascent (Distinct X,Y coordinates) ---

      // Step 5: JUMP UP (Top View)
      // From (0, 1, -2) to (0, 3, -1).
      // Top View Delta: Z (-2 -> -1). Valid.
      // Y changes 1 -> 3.
      // Block has RED LEFT. (Must use Back View or Top View).
      { 
        x: 0, y: 3, z: -1, 
        type: 'platform',
        dangerFaces: ['left']
      },

      // Step 6: CROSS (Side View)
      // From (0, 3, -1) to (2, 3, -2).
      // Side View Delta: X (0 -> 2) ?? Too far (2 blocks).
      // Need intermediate or diagonal logic? 
      // Let's do (2, 3, -1) first? No, let's keep it tight.
      // Move to (1, 3, -1) first.
      { 
        x: 1, y: 3, z: -1, 
        type: 'platform',
        dangerFaces: ['front'] // Blocked from front
      },
      // Then to (2, 3, -2) using Side View.
      // (1,3) -> (2,3). Z changes -1 -> -2.
      { 
        x: 2, y: 3, z: -2, 
        type: 'goal' 
      },

      // --- DECO CLOUD (Misdirection) ---
      // Placed to confuse depth, but NOT to allow shortcuts.
      { x: 0, y: 0, z: 0, type: 'deco' }, // The Center Void
      { x: 2, y: -1, z: 3, type: 'deco' }, // Far corner
      { x: -1, y: 3, z: -2, type: 'deco' }, // High corner
    ]
  }
];
