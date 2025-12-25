import { LevelData } from './types';

export const LEVELS: LevelData[] = [
  {
    id: 1,
    name: "First Steps",
    description: "Rotate until the gap disappears.",
    quote: "A journey of a thousand miles begins with a single step.",
    startPos: [0, 0, 0],
    goalPos: [0, 0, -4],
    blocks: [
      { x: 0, y: 0, z: 0, type: 'start' },
      { x: 0, y: 0, z: -1, type: 'platform' },
      { x: 2, y: 0, z: -2, type: 'platform' }, // Gap Filler
      { x: 0, y: 0, z: -3, type: 'platform' },
      { x: 0, y: 0, z: -4, type: 'goal' },
      // Decos
      { x: 3, y: -3, z: 0, type: 'deco' },
      { x: -3, y: 2, z: -3, type: 'deco' },
      { x: 2, y: 3, z: -6, type: 'deco' },
      { x: -2, y: -2, z: -1, type: 'deco' },
    ]
  },
  {
    id: 2,
    name: "Bird's Eye View",
    description: "Switch to Top View to walk across heights.",
    quote: "Change your thoughts and you change your world.",
    startPos: [0, 0, 0],
    goalPos: [3, 4, 0],
    blocks: [
      { x: 0, y: 0, z: 0, type: 'start' },
      { x: 1, y: 0, z: 0, type: 'platform' },
      { x: 2, y: 2, z: 0, type: 'platform' },
      { x: 3, y: 4, z: 0, type: 'goal' },
      // Decos
      { x: 4, y: -1, z: 3, type: 'deco' },
      { x: 4, y: -1, z: -3, type: 'deco' },
      { x: 0, y: -4, z: 0, type: 'deco' },
      { x: 5, y: 1, z: 0, type: 'deco' },
      { x: 1, y: 6, z: 3, type: 'deco' },
    ]
  },
  {
    id: 3,
    name: "The Invisible Staircase",
    description: "In Top View, height is meaningless.",
    quote: "What is essential is invisible to the eye.",
    startPos: [0, 0, 0],
    goalPos: [1, 6, 2],
    blocks: [
      { x: 0, y: 0, z: 0, type: 'start' },
      { x: 1, y: 0, z: 0, type: 'platform' },
      { x: 1, y: 2, z: 1, type: 'platform' },
      { x: 0, y: 2, z: 1, type: 'platform' },
      { x: 0, y: 4, z: 2, type: 'platform' },
      { x: 1, y: 6, z: 2, type: 'goal' },
      // Decos
      { x: 3, y: -1, z: 3, type: 'deco' },
      { x: -4, y: 3, z: -1, type: 'deco' },
      { x: 2, y: 7, z: -1, type: 'deco' },
      { x: 4, y: 2, z: 4, type: 'deco' },
      { x: 0, y: -3, z: -3, type: 'deco' },
    ]
  },
  {
    id: 4,
    name: "The Occlusion Bridge",
    description: "Use the floating pillar to bridge the gap.",
    quote: "We build too many walls and not enough bridges.",
    startPos: [-2, 0, 0],
    goalPos: [2, 0, 0],
    blocks: [
      { x: -2, y: 0, z: 0, type: 'start' },
      { x: -1, y: 0, z: 0, type: 'platform' },
      { x: 0, y: 3, z: 0, type: 'platform' },
      { x: 1, y: 0, z: 0, type: 'platform' },
      { x: 2, y: 0, z: 0, type: 'goal' },
      // Decos
      { x: 0, y: -4, z: 3, type: 'deco' },
      { x: 0, y: 5, z: -3, type: 'deco' },
      { x: -3, y: 2, z: 3, type: 'deco' },
      { x: 3, y: 5, z: -2, type: 'deco' },
      { x: 0, y: 8, z: 0, type: 'deco' },
    ]
  },
  {
    id: 5,
    name: "Urban Canyon",
    description: "Staggered steps. Keep offsets to exactly 1 unit.",
    quote: "Order is the sanity of the mind, the health of the body.",
    startPos: [0, 0, 0],
    goalPos: [-1, 4, -4],
    blocks: [
      { x: 0, y: 0, z: 0, type: 'start' },
      { x: 1, y: 0, z: -2, type: 'platform' },
      { x: 1, y: 2, z: -3, type: 'platform' },
      { x: 0, y: 2, z: -3, type: 'platform' },
      { x: -1, y: 4, z: -3, type: 'platform' },
      { x: -1, y: 4, z: -4, type: 'goal' },
      { x: 2, y: 0, z: 0, type: 'deco' },
      { x: -2, y: 4, z: -2, type: 'deco' },
    ]
  },
  {
    id: 6,
    name: "The Phantom Helix",
    description: "An expanding spiral. No stacking allowed.",
    quote: "The spiral is the spiritualized circle.",
    startPos: [0, 0, 0],
    goalPos: [3, 4, -5],
    blocks: [
      { x: 0, y: 0, z: 0, type: 'start' },
      { x: 1, y: 0, z: -2, type: 'platform' },
      { x: 1, y: 2, z: -3, type: 'platform' },
      { x: 2, y: 2, z: -5, type: 'platform' },
      { x: 3, y: 4, z: -5, type: 'goal' },
      { x: -2, y: 2, z: 0, type: 'deco' },
      { x: 5, y: 0, z: -5, type: 'deco' },
    ]
  },
  {
    id: 7,
    name: "Disjointed Reality",
    description: "Floating islands with precise 1-unit visual gaps.",
    quote: "Reality is merely an illusion, albeit a very persistent one.",
    startPos: [-2, 0, 2],
    goalPos: [1, 4, -2],
    blocks: [
      { x: -2, y: 0, z: 2, type: 'start' },
      { x: -1, y: 0, z: 2, type: 'platform' },
      { x: 0, y: 0, z: 0, type: 'platform' },
      { x: 1, y: 2, z: 0, type: 'platform' },
      { x: 2, y: 2, z: -2, type: 'platform' },
      { x: 1, y: 4, z: -2, type: 'goal' },
      { x: 0, y: 4, z: 2, type: 'deco' },
      { x: -2, y: 2, z: -2, type: 'deco' },
    ]
  },
  {
    id: 8,
    name: "The Void Steps",
    description: "Precise adjacent jumps.",
    quote: "In the middle of difficulty lies opportunity.",
    startPos: [0, 0, 0],
    goalPos: [0, 5, -5],
    blocks: [
      { x: 0, y: 0, z: 0, type: 'start' },
      { x: -1, y: 0, z: -2, type: 'platform' },
      { x: 0, y: 2, z: -2, type: 'platform' },
      { x: -1, y: 2, z: -5, type: 'platform' },
      { x: 0, y: 5, z: -5, type: 'goal' },
      { x: 2, y: 0, z: -2, type: 'deco' },
      { x: -3, y: 4, z: 0, type: 'deco' },
    ]
  },
  {
    id: 9,
    name: "Perspective Lock",
    description: "A straight corridor. Every step forces a specific camera angle.",
    quote: "The only thing you can change is your perspective.",
    startPos: [-4, 0, 0],
    goalPos: [4, 0, 0],
    blocks: [
      { x: -4, y: 0, z: 0, type: 'start' },
      // 1. MUST USE TOP VIEW
      { x: -3, y: 0, z: 0, type: 'platform', dangerFaces: ['front', 'back', 'right', 'left'] },
      // 2. MUST USE FRONT VIEW (Side)
      { x: -2, y: 0, z: 0, type: 'platform', dangerFaces: ['top', 'back', 'left'] },
      // 3. MUST USE BACK VIEW (Rotate Camera)
      { x: -1, y: 0, z: 0, type: 'platform', dangerFaces: ['top', 'front', 'right'] },
      // 4. MUST USE TOP VIEW AGAIN
      { x: 0, y: 0, z: 0, type: 'platform', dangerFaces: ['front', 'back', 'right', 'left'] },
      // 5. MUST USE FRONT VIEW
      { x: 1, y: 0, z: 0, type: 'platform', dangerFaces: ['top', 'back'] },
      // 6. MUST USE BACK VIEW
      { x: 2, y: 0, z: 0, type: 'platform', dangerFaces: ['top', 'front'] },
      // 7. MUST USE TOP VIEW (Final Stretch)
      { x: 3, y: 0, z: 0, type: 'platform', dangerFaces: ['front', 'back'] },
      // Goal
      { x: 4, y: 0, z: 0, type: 'goal' },
      // Decos
      { x: -3, y: 0, z: 2, type: 'deco' },
      { x: -1, y: 2, z: 0, type: 'deco' },
      { x: 1, y: 0, z: -2, type: 'deco' },
      { x: 3, y: 2, z: 0, type: 'deco' },
    ]
  },
  {
    id: 10,
    name: "The Zig-Zag Path",
    description: "Follow the Green Line. Rotate: Front -> Right -> Back -> Left -> Front -> Right.",
    quote: "The path is not a straight line; it's a spiral.",
    startPos: [-3, 0, 3],
    goalPos: [3, 0, -3],
    blocks: [
      // === ROW Z=3 ===
      { x: -3, y: 0, z: 3, type: 'start' }, // [Start]
      { x: -1, y: 0, z: 3, type: 'platform', dangerFaces: ['back', 'left', 'top', 'bottom'] }, // [Node 1] Safe: Front, Right
      { x: 1, y: 0, z: 3, type: 'platform', dangerFaces: ['front', 'back', 'left', 'right', 'top', 'bottom'] }, // Filler
      { x: 3, y: 0, z: 3, type: 'platform', dangerFaces: ['front', 'back', 'left', 'right', 'top', 'bottom'] }, // Filler

      // === ROW Z=2 ===
      { x: -2, y: 0, z: 2, type: 'platform', dangerFaces: ['back', 'left', 'right', 'top', 'bottom'] }, // [Bridge 1] Safe: Front (Connects Start -> Node 1)
      { x: 0, y: 0, z: 2, type: 'platform', dangerFaces: ['front', 'back', 'left', 'top', 'bottom'] }, // [Bridge 2] Safe: Right (Connects Node 1 -> Node 2)
      { x: 2, y: 0, z: 2, type: 'platform', dangerFaces: ['front', 'back', 'left', 'right', 'top', 'bottom'] }, // Filler

      // === ROW Z=1 ===
      { x: -3, y: 0, z: 1, type: 'platform', dangerFaces: ['front', 'back', 'left', 'right', 'top', 'bottom'] }, // Filler
      { x: -1, y: 0, z: 1, type: 'platform', dangerFaces: ['front', 'left', 'top', 'bottom'] }, // [Node 2] Safe: Right, Back
      { x: 1, y: 0, z: 1, type: 'platform', dangerFaces: ['front', 'right', 'top', 'bottom'] }, // [Node 3] Safe: Back, Left
      { x: 3, y: 0, z: 1, type: 'platform', dangerFaces: ['front', 'back', 'left', 'right', 'top', 'bottom'] }, // Filler

      // === ROW Z=0 ===
      { x: -2, y: 0, z: 0, type: 'platform', dangerFaces: ['front', 'back', 'left', 'right', 'top', 'bottom'] }, // Filler
      { x: 0, y: 0, z: 0, type: 'platform', dangerFaces: ['front', 'left', 'right', 'top', 'bottom'] }, // [Bridge 3] Safe: Back (Connects Node 2 -> Node 3)
      { x: 2, y: 0, z: 0, type: 'platform', dangerFaces: ['front', 'back', 'right', 'top', 'bottom'] }, // [Bridge 4] Safe: Left (Connects Node 3 -> Node 4)

      // === ROW Z=-1 ===
      { x: -3, y: 0, z: -1, type: 'platform', dangerFaces: ['front', 'back', 'left', 'right', 'top', 'bottom'] }, // Filler
      { x: -1, y: 0, z: -1, type: 'platform', dangerFaces: ['front', 'back', 'left', 'right', 'top', 'bottom'] }, // Filler
      { x: 1, y: 0, z: -1, type: 'platform', dangerFaces: ['back', 'right', 'top', 'bottom'] }, // [Node 4] Safe: Left, Front
      { x: 3, y: 0, z: -1, type: 'platform', dangerFaces: ['back', 'left', 'top', 'bottom'] }, // [Node 5] Safe: Front, Right

      // === ROW Z=-2 ===
      { x: -2, y: 0, z: -2, type: 'platform', dangerFaces: ['front', 'back', 'left', 'right', 'top', 'bottom'] }, // Filler
      { x: 0, y: 0, z: -2, type: 'platform', dangerFaces: ['front', 'back', 'left', 'right', 'top', 'bottom'] }, // Filler
      { x: 2, y: 0, z: -2, type: 'platform', dangerFaces: ['back', 'left', 'top', 'bottom'] }, // [Bridge 5] Safe: Front & Right (Connects N4->N5 & N5->Goal)

      // === ROW Z=-3 ===
      { x: -3, y: 0, z: -3, type: 'platform', dangerFaces: ['front', 'back', 'left', 'right', 'top', 'bottom'] }, // Filler
      { x: -1, y: 0, z: -3, type: 'platform', dangerFaces: ['front', 'back', 'left', 'right', 'top', 'bottom'] }, // Filler
      { x: 1, y: 0, z: -3, type: 'platform', dangerFaces: ['front', 'back', 'left', 'right', 'top', 'bottom'] }, // Filler
      { x: 3, y: 0, z: -3, type: 'goal' }, // [Goal]
    ]
  }
];