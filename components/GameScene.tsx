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
      const baseMatProps: any = {
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
        baseMatProps.color = 0xd946ef; 
        baseMatProps.emissive = 0xa21caf; 
        baseMatProps.emissiveIntensity = 0.5;
        baseMatProps.transparent = true;
        baseMatProps.opacity = 0.25; 
        baseMatProps.roughness = 0.1;
        baseMatProps.metalness = 0.5;
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
    cameraState.current = { 
        theta: Math.PI / 4, 
        phi: FREE_ROAM_PHI, 
        radius: 20 
    };
    setViewMode('SIDE'); 
    setMsg("Drag & Release to Align Perspective"); 
    
    if (cameraRef.current) {
        updateCameraPosition(cameraRef.current, cameraState.current);
    }
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

    // Current Player Visual Center
    const currentVisPos = new THREE.Vector3(
        playerGridPos.current.x, 
        playerGridPos.current.y + CUBE_SIZE/2, 
        playerGridPos.current.z
    );
    const pScreen = currentVisPos.clone().project(cam);
    const pScreen2D = new THREE.Vector2(pScreen.x, pScreen.y);

    // 2. Determine "Reference Step Size"
    // Which of the 4 cardinal directions (North, South, East, West) best matches the input visually?
    // And how "long" is a single step in that direction on screen?
    const candidates3D = [
        new THREE.Vector3(0, 0, -1), // North
        new THREE.Vector3(0, 0, 1),  // South
        new THREE.Vector3(-1, 0, 0), // West
        new THREE.Vector3(1, 0, 0)   // East
    ];

    let best3DDir: THREE.Vector3 | null = null;
    let maxDot = 0;
    let refStepScreenLen = 0;

    candidates3D.forEach(v3 => {
        const testPos = currentVisPos.clone().add(v3);
        const testScreen = testPos.project(cam);
        const testScreen2D = new THREE.Vector2(testScreen.x, testScreen.y);
        const dir2D = new THREE.Vector2().subVectors(testScreen2D, pScreen2D);
        const len = dir2D.length();

        // Avoid degenerate directions (steps that go strictly into/out of screen)
        if (len < 0.02) return; 

        const dot = dir2D.clone().normalize().dot(inputScreenDir);
        if (dot > maxDot) {
            maxDot = dot;
            best3DDir = v3;
            refStepScreenLen = len;
        }
    });

    // If no direction matches nicely (e.g. view is awkward), abort
    if (!best3DDir || maxDot < 0.8) {
        shakeCamera();
        audioController?.playFail();
        return;
    }

    // 3. Scan ALL blocks to find one that matches visual criteria
    const validBlocks: { mesh: THREE.Mesh, camDist: number }[] = [];

    // Safety: Determine visible face for danger blocks
    let visibleFace: BlockFace | null = null;
    if (viewMode === 'TOP') {
        visibleFace = 'top';
    } else {
        let t = cameraState.current.theta % (Math.PI * 2);
        if (t < 0) t += Math.PI * 2;
        const quadrant = Math.round(t / (Math.PI / 2)) % 4;
        
        if (quadrant === 0) visibleFace = 'front';
        else if (quadrant === 1) visibleFace = 'right';
        else if (quadrant === 2) visibleFace = 'back';
        else if (quadrant === 3) visibleFace = 'left';
    }

    const checkSafe = (mesh: THREE.Mesh) => {
        const d = mesh.userData;
        if (d.type === 'deco') return false;
        if (d.dangerFaces && visibleFace && d.dangerFaces.includes(visibleFace)) return false;
        return true;
    };

    for (const blockMesh of blocksRef.current) {
        // Skip self
        if (blockMesh.userData.x === playerGridPos.current.x && 
            blockMesh.userData.y === playerGridPos.current.y && 
            blockMesh.userData.z === playerGridPos.current.z) continue;

        if (!checkSafe(blockMesh)) continue;

        const bVis = new THREE.Vector3(blockMesh.userData.x, blockMesh.userData.y + CUBE_SIZE/2, blockMesh.userData.z);
        const bScreen = bVis.clone().project(cam);
        const bScreen2D = new THREE.Vector2(bScreen.x, bScreen.y);

        const diffVec = new THREE.Vector2().subVectors(bScreen2D, pScreen2D);
        const dist = diffVec.length();
        
        // CRITICAL CHECK 1: Direction Alignment
        // Does this block lie in the direction of the input?
        if (diffVec.normalize().dot(inputScreenDir) < 0.95) continue;

        // CRITICAL CHECK 2: Step Size Matching
        // Is this block approx 1 step away?
        // Tolerance is relative to the step size to handle different resolutions/screens
        const tolerance = refStepScreenLen * 0.25; 
        if (Math.abs(dist - refStepScreenLen) > tolerance) continue;

        validBlocks.push({ 
            mesh: blockMesh, 
            camDist: blockMesh.position.distanceTo(cam.position) 
        });
    }

    if (validBlocks.length > 0) {
        // Sort by visual depth (closest to camera wins, simulating walking "on" the visible surface)
        validBlocks.sort((a, b) => a.camDist - b.camDist);
        movePlayer(validBlocks[0].mesh);
    } else {
        shakeCamera();
        audioController?.playFail();
    }
  };

  const shakeCamera = () => {
    gsap.to(cameraState.current, {
        radius: 19.8,
        yoyo: true,
        repeat: 1,
        duration: 0.05
      });
  };

  const handleDeath = () => {
    setIsResetting(true);
    setMsg("PARADOX DETECTED - RESETTING");
    audioController?.playFail();
    
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
        <h1 className="text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-blue-400 mb-2 drop-shadow-[0_0_15px_rgba(200,100,255,0.6)]">MINDPOINT</h1>
        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mb-4 shadow-[0_0_10px_#d8b4fe]"></div>
        <p className="text-purple-200/80 font-mono text-sm uppercase tracking-widest">Level {level.id} - {level.name}</p>
        {level.quote && (
          <p className="text-xs italic text-purple-300/70 mt-1 mb-2 font-serif max-w-sm">"{level.quote}"</p>
        )}
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