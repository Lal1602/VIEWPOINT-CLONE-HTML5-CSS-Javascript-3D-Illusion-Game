import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { LevelData, BlockFace } from '../types';
import { AudioController } from '../utils/audio';

interface GameSceneProps {
  level: LevelData;
  onLevelComplete: () => void;
  audioController: AudioController | null;
}

const CUBE_SIZE = 0.5; 
const BLOCK_SIZE = 1;
const MOVE_DURATION = 0.35;

// Perspective Constants
const VIEW_SIZE = 10;
const ISO_PHI = Math.PI / 2; // 90 degrees = Perfect Side View (Depth Flattened)
const TOP_PHI = 0.0001;        
const SNAP_THRESHOLD_PHI = Math.PI / 4; 
const FREE_ROAM_PHI = Math.PI / 2.5; // ~72 degrees. High enough to see depth, low enough to look like side view.

export const GameScene: React.FC<GameSceneProps> = ({ level, onLevelComplete, audioController }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [msg, setMsg] = useState("Drag to explore 3D. Release to Flatten.");
  const [viewMode, setViewMode] = useState<'SIDE' | 'TOP'>('SIDE');
  const [isResetting, setIsResetting] = useState(false);

  // Three.js Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const playerRef = useRef<THREE.Mesh | null>(null);
  const blocksRef = useRef<THREE.Mesh[]>([]);
  const starSystemRef = useRef<THREE.Points | null>(null);
  
  // Game Logic Refs
  const isMovingRef = useRef(false);
  const playerGridPos = useRef(new THREE.Vector3());
  
  // Camera Spherical Coords
  const cameraState = useRef({ 
    theta: Math.PI / 4, 
    phi: ISO_PHI, 
    radius: 20 
  });
  
  // Input Refs
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const startCameraState = useRef({ theta: 0, phi: 0 });

  // ---------------- INITIALIZATION ---------------- //

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene Setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a0b2e, 0.015); // Deep Purple Fog
    
    const aspect = width / height;
    const camera = new THREE.OrthographicCamera(
      -VIEW_SIZE * aspect, VIEW_SIZE * aspect,
      VIEW_SIZE, -VIEW_SIZE,
      1, 1000
    );
    
    updateCameraPosition(camera, cameraState.current);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // --- ENHANCED GALAXY STARFIELD ---
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 4000;
    const posArray = new Float32Array(starCount * 3);
    const sizeArray = new Float32Array(starCount);
    const colorArray = new Float32Array(starCount * 3);

    const colorPalette = [
        new THREE.Color(0xffffff), // White
        new THREE.Color(0xaaccff), // Blueish
        new THREE.Color(0xffccff), // Pinkish
        new THREE.Color(0xccaaff), // Purpleish
        new THREE.Color(0xffd700), // Gold hint
    ];

    for(let i = 0; i < starCount; i++) {
        const r = 30 + Math.random() * 80;
        const theta = Math.random() * Math.PI * 2;
        const spread = 0.5; 
        const phi = (Math.PI / 2) + (Math.random() - 0.5) * spread * 2;
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.cos(phi) * (0.5 + Math.random()); 
        const z = r * Math.sin(phi) * Math.sin(theta);

        posArray[i*3] = x;
        posArray[i*3+1] = y;
        posArray[i*3+2] = z;
        
        sizeArray[i] = Math.random() * 2.0;

        const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colorArray[i*3] = c.r;
        colorArray[i*3+1] = c.g;
        colorArray[i*3+2] = c.b;
    }
    
    starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    starsGeo.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
    starsGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const starMat = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true, 
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
    });

    const starSystem = new THREE.Points(starsGeo, starMat);
    scene.add(starSystem);
    starSystemRef.current = starSystem;

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.5); 
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffddee, 1.0); 
    dir.position.set(10, 20, 10);
    dir.castShadow = true;
    dir.shadow.mapSize.set(2048, 2048);
    dir.shadow.radius = 4;
    scene.add(dir);

    const rimLight = new THREE.DirectionalLight(0x4444ff, 0.8);
    rimLight.position.set(-10, 5, -10);
    scene.add(rimLight);

    // Refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    const animate = () => {
      requestAnimationFrame(animate);
      
      if (starSystemRef.current) {
          starSystemRef.current.rotation.y += 0.0002;
          starSystemRef.current.rotation.z = Math.sin(Date.now() * 0.0001) * 0.05;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      const asp = w / h;
      cameraRef.current.left = -VIEW_SIZE * asp;
      cameraRef.current.right = VIEW_SIZE * asp;
      cameraRef.current.top = VIEW_SIZE;
      cameraRef.current.bottom = -VIEW_SIZE;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, []);

  // ---------------- LEVEL BUILDING ---------------- //

  const buildLevel = () => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    blocksRef.current.forEach(mesh => scene.remove(mesh));
    if (playerRef.current) scene.remove(playerRef.current);
    blocksRef.current = [];

    playerGridPos.current.set(...level.startPos);
    
    const pGeo = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const pMat = new THREE.MeshStandardMaterial({ 
      color: 0xffffff, 
      emissive: 0xffffff, 
      emissiveIntensity: 1.0,
      roughness: 0.1,
      metalness: 0.1
    });
    const player = new THREE.Mesh(pGeo, pMat);
    player.position.set(
        playerGridPos.current.x,
        playerGridPos.current.y + CUBE_SIZE/2, 
        playerGridPos.current.z
    );
    player.castShadow = true;
    playerRef.current = player;
    scene.add(player);

    const pLight = new THREE.PointLight(0xffffff, 1.5, 4);
    player.add(pLight);

    level.blocks.forEach(block => {
      const geo = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      
      // Default Material Props
      const baseMatProps = {
        color: 0xdcdcdc,
        emissive: 0x000000,
        emissiveIntensity: 0.2,
        roughness: 0.2,
        metalness: 0.6,
      };

      if (block.type === 'goal') {
        baseMatProps.color = 0x00ff88; 
        baseMatProps.emissive = 0x004422;
        baseMatProps.metalness = 0.1;
      } else if (block.type === 'start') {
        baseMatProps.color = 0x888899; 
      } else if (block.type === 'deco') {
        baseMatProps.color = 0x050505; 
        baseMatProps.roughness = 0.9;
        baseMatProps.metalness = 0.1;
      }

      // Material creation logic
      let mat: THREE.Material | THREE.Material[];

      if (block.dangerFaces && block.dangerFaces.length > 0) {
        // Create 6 materials for the cube
        // Order: right (x+), left (x-), top (y+), bottom (y-), front (z+), back (z-)
        const faceOrder: BlockFace[] = ['right', 'left', 'top', 'bottom', 'front', 'back'];
        
        mat = faceOrder.map(face => {
            const isDanger = block.dangerFaces?.includes(face);
            return new THREE.MeshStandardMaterial({
                ...baseMatProps,
                color: isDanger ? 0xff0000 : baseMatProps.color,
                emissive: isDanger ? 0x880000 : baseMatProps.emissive,
                emissiveIntensity: isDanger ? 0.8 : baseMatProps.emissiveIntensity,
                roughness: isDanger ? 0.1 : baseMatProps.roughness
            });
        });
      } else {
         // Single material
         mat = new THREE.MeshStandardMaterial(baseMatProps);
      }
      
      const mesh = new THREE.Mesh(geo, mat);
      
      mesh.position.set(block.x, block.y - BLOCK_SIZE/2, block.z);
      mesh.userData = { ...block };
      mesh.receiveShadow = true;
      mesh.castShadow = true;
      mesh.scale.set(0.98, 0.98, 0.98);

      scene.add(mesh);
      blocksRef.current.push(mesh);
    });

    setIsResetting(false);
  };

  // Reset camera when level changes
  useEffect(() => {
    // 1. Reset Camera State to "Free Roam" / "Inspection" Mode
    // Instead of snapping directly to ISO_PHI (Side View), we set it to FREE_ROAM_PHI.
    // This creates a 3D isometric look where depth is visible.
    cameraState.current = { 
        theta: Math.PI / 4, // 45 degrees
        phi: FREE_ROAM_PHI, // Slightly elevated "3D" look
        radius: 20 
    };
    
    // 2. Reset UI
    setViewMode('SIDE'); // Default logic state, even though visually it's 3D
    setMsg("Drag & Release to Align Perspective"); // Prompt user to interact
    
    // 3. Apply Camera Update Immediately
    if (cameraRef.current) {
        updateCameraPosition(cameraRef.current, cameraState.current);
    }

    // 4. Build Level
    buildLevel();
  }, [level]);

  // ---------------- CONTROLS & LOGIC ---------------- //

  const updateCameraPosition = (cam: THREE.Camera, angle: { theta: number, phi: number, radius: number }) => {
    const x = angle.radius * Math.sin(angle.phi) * Math.sin(angle.theta);
    const y = angle.radius * Math.cos(angle.phi);
    const z = angle.radius * Math.sin(angle.phi) * Math.cos(angle.theta);
    cam.position.set(x, y, z);
    cam.lookAt(0, 0, 0);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isResetting) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    startCameraState.current = { ...cameraState.current };
    gsap.killTweensOf(cameraState.current);
    setMsg("3D Mode Active...");
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !cameraRef.current) return;

    const deltaX = e.clientX - dragStart.current.x;
    const deltaY = e.clientY - dragStart.current.y;
    
    const SENSITIVITY = 0.008;

    cameraState.current.theta = startCameraState.current.theta - deltaX * SENSITIVITY;
    cameraState.current.phi = startCameraState.current.phi - deltaY * SENSITIVITY;

    cameraState.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraState.current.phi));

    updateCameraPosition(cameraRef.current, cameraState.current);
  };

  const handlePointerUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      snapCamera();
      audioController?.playSnap();
    }
  };

  const snapCamera = (instant = false) => {
    const snapStep = Math.PI / 2;
    const snappedTheta = Math.round(cameraState.current.theta / snapStep) * snapStep;

    let snappedPhi = ISO_PHI; 
    let modeText = "SIDE VIEW (2D)";
    let newMode: 'SIDE' | 'TOP' = 'SIDE';

    if (cameraState.current.phi < SNAP_THRESHOLD_PHI) {
      snappedPhi = TOP_PHI;
      modeText = "TOP VIEW (2D)";
      newMode = 'TOP';
    } 

    setMsg(modeText);
    setViewMode(newMode);

    if (instant) {
      cameraState.current.theta = snappedTheta;
      cameraState.current.phi = snappedPhi;
      if (cameraRef.current) updateCameraPosition(cameraRef.current, cameraState.current);
    } else {
      const easeFunc = newMode === 'TOP' ? "power4.out" : "back.out(1.7)";

      gsap.to(cameraState.current, {
        theta: snappedTheta,
        phi: snappedPhi,
        duration: 0.6,
        ease: easeFunc,
        onUpdate: () => {
            cameraState.current.phi = Math.max(0.0001, Math.min(Math.PI - 0.0001, cameraState.current.phi));
            if (cameraRef.current) updateCameraPosition(cameraRef.current, cameraState.current);
        }
      });
    }
  };


  const checkMove = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (isMovingRef.current || isDragging.current || !cameraRef.current || !playerRef.current || isResetting) return;

    const cam = cameraRef.current;
    
    // 1. Get Input Direction (Screen Space)
    let inputScreenDir = new THREE.Vector2();
    if (direction === 'UP') inputScreenDir.set(0, 1);
    if (direction === 'DOWN') inputScreenDir.set(0, -1);
    if (direction === 'LEFT') inputScreenDir.set(-1, 0);
    if (direction === 'RIGHT') inputScreenDir.set(1, 0);

    const candidates = [
      { vec: new THREE.Vector3(0, 0, -1), label: 'North' },
      { vec: new THREE.Vector3(0, 0, 1), label: 'South' },
      { vec: new THREE.Vector3(-1, 0, 0), label: 'West' },
      { vec: new THREE.Vector3(1, 0, 0), label: 'East' },
    ];

    const pVis = playerRef.current.position.clone();
    const pScreen = pVis.clone().project(cam);

    let bestWorldDir = new THREE.Vector3();
    let maxDot = -Infinity;

    candidates.forEach(c => {
        const testPos = pVis.clone().add(c.vec.clone().multiplyScalar(0.5));
        const testScreen = testPos.project(cam);
        const dirScreen = new THREE.Vector2(testScreen.x - pScreen.x, testScreen.y - pScreen.y).normalize();
        
        const dot = dirScreen.dot(inputScreenDir);
        if (dot > maxDot) {
            maxDot = dot;
            bestWorldDir = c.vec;
        }
    });

    if (maxDot < 0.5) return; 

    // 2. Calculate Ideal Screen Target (Where we want to be on screen)
    const idealStepGridPos = playerGridPos.current.clone().add(bestWorldDir);
    const idealStepVisPos = new THREE.Vector3(
        idealStepGridPos.x, 
        playerGridPos.current.y + CUBE_SIZE/2, 
        idealStepGridPos.z
    );
    const idealStepScreen = idealStepVisPos.project(cam);
    const idealScreen2D = new THREE.Vector2(idealStepScreen.x, idealStepScreen.y);

    // 3. Determine VISIBLE FACE based on Camera Angle
    // This logic determines which face of a block implies "Danger" if seen.
    let visibleFace: BlockFace | null = null;
    
    if (viewMode === 'TOP') {
        visibleFace = 'top';
    } else {
        // Normalize theta to 0 - 2PI
        let t = cameraState.current.theta % (Math.PI * 2);
        if (t < 0) t += Math.PI * 2;

        // Snap to nearest quadrant to determine "Main View"
        // 0 = Front (looking at Z- face? No, looking at Front Z+ face... wait)
        // Camera at (0, 0, 20) is Theta=0. Looking at (0,0,0). It sees the Z+ face (Front).
        // Camera at (20, 0, 0) is Theta=PI/2. Sees X+ face (Right).
        const quadrant = Math.round(t / (Math.PI / 2)) % 4;
        
        if (quadrant === 0) visibleFace = 'front';
        else if (quadrant === 1) visibleFace = 'right';
        else if (quadrant === 2) visibleFace = 'back';
        else if (quadrant === 3) visibleFace = 'left';
    }

    // 4. Find Valid Blocks (Optical Illusion Check)
    const TOLERANCE = 0.05; 
    const validBlocks: THREE.Mesh[] = [];

    for (const blockMesh of blocksRef.current) {
        const bData = blockMesh.userData;
        
        // Skip current block
        if (bData.x === playerGridPos.current.x && 
            bData.y === playerGridPos.current.y && 
            bData.z === playerGridPos.current.z) continue;

        // Check if black deco (void)
        if (bData.type === 'deco') continue;

        // *** NEW LOGIC: PER-FACE DANGER ***
        // If the block has a red face, and we are looking at that face, IT IS A WALL.
        if (bData.dangerFaces && visibleFace && bData.dangerFaces.includes(visibleFace)) {
            // Visual feedback could be added here (e.g., glitch effect)
            continue; 
        }

        const bVis = new THREE.Vector3(bData.x, bData.y + CUBE_SIZE/2, bData.z);
        const bScreen = bVis.project(cam);
        const bScreen2D = new THREE.Vector2(bScreen.x, bScreen.y);
        
        // Strictly use 2D distance
        if (idealScreen2D.distanceTo(bScreen2D) < TOLERANCE) {
            validBlocks.push(blockMesh);
        }
    }

    if (validBlocks.length > 0) {
        // TOP VIEW SPECIAL LOGIC: Stacked blocks? Pick the HIGHEST one.
        if (viewMode === 'TOP') {
             validBlocks.sort((a, b) => b.userData.y - a.userData.y);
        }
        
        movePlayer(validBlocks[0]);
    } else {
      // Wall Hit Effect
      gsap.to(cameraState.current, {
        radius: 19.8,
        yoyo: true,
        repeat: 1,
        duration: 0.05
      });
      audioController?.playFail(); // Feedback for hitting a "red wall" or empty space
    }
  };

  const handleDeath = () => {
    setIsResetting(true);
    setMsg("PARADOX DETECTED - RESETTING");
    audioController?.playFail();
    
    // Shake effect
    gsap.to(cameraState.current, {
        radius: 18,
        yoyo: true,
        repeat: 5,
        duration: 0.05
    });

    if(playerRef.current) {
        gsap.to(playerRef.current.scale, { x:0, y:0, z:0, duration: 0.3 });
    }

    setTimeout(() => {
        buildLevel(); 
    }, 1000);
  };

  const movePlayer = (targetBlock: THREE.Mesh) => {
    if (isMovingRef.current || !playerRef.current) return;
    isMovingRef.current = true;

    const bData = targetBlock.userData;
    
    // Animate
    gsap.to(playerRef.current.position, {
        x: bData.x,
        y: bData.y + CUBE_SIZE/2,
        z: bData.z,
        duration: MOVE_DURATION,
        ease: "power1.inOut",
        onComplete: () => {
            isMovingRef.current = false;
            playerGridPos.current.set(bData.x, bData.y, bData.z);
            
            if (bData.type === 'goal') {
                setMsg("COSMIC ALIGNMENT REACHED");
                audioController?.playWin();
                setTimeout(onLevelComplete, 1500);
            } else {
                audioController?.playMove();
            }
        }
    });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code.startsWith('Arrow')) {
        const dir = e.code.replace('Arrow', '').toUpperCase() as any;
        checkMove(dir);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [viewMode, isResetting]); 

  return (
    <div 
      className={`relative w-full h-full cursor-grab active:cursor-grabbing transition-colors duration-300 ${isResetting ? 'bg-red-900/20' : ''}`}
      style={{ 
        background: isResetting 
          ? '#200' 
          : 'radial-gradient(ellipse at bottom left, #290f38 0%, #000000 70%), radial-gradient(circle at top right, #0f1c38 0%, #000000 60%)',
        backgroundColor: '#000'
      }} 
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div ref={mountRef} className="w-full h-full" />
      
      {/* UI Overlay */}
      <div className="absolute top-8 left-8 pointer-events-none select-none z-10">
        <h1 className="text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-blue-400 mb-2 drop-shadow-[0_0_15px_rgba(200,100,255,0.6)]">VIEWPOINT</h1>
        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mb-4 shadow-[0_0_10px_#d8b4fe]"></div>
        <p className="text-purple-200/80 font-mono text-sm uppercase tracking-widest">Level {level.id} // {level.name}</p>
        <p className="text-xs text-purple-400/50 mt-1 max-w-xs">{level.description}</p>
      </div>

      <div className="absolute bottom-12 w-full text-center pointer-events-none z-10">
        <p className={`inline-block px-4 py-2 border font-mono text-xs tracking-[0.2em] rounded backdrop-blur-md transition-all duration-300 ${
            isResetting ? 'bg-red-900/60 border-red-500 text-red-200 animate-pulse' :
            isDragging.current ? 'bg-purple-900/40 border-purple-300 text-purple-100 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-black/60 border-green-400/50 text-green-300'
        }`}>
           {msg}
        </p>
      </div>
      
      <div className="absolute top-8 right-8 text-right pointer-events-none space-y-2 z-10">
         <div className="text-xs font-mono text-purple-300/60">CONTROLS</div>
         <div className="text-xs font-mono text-white drop-shadow-md">DRAG to Explore 3D</div>
         <div className="text-xs font-mono text-white drop-shadow-md">RELEASE to Flatten</div>
         <div className="text-xs font-mono text-white drop-shadow-md">ARROWS to Move</div>
      </div>
    </div>
  );
};
