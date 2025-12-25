import React, { useState, useEffect, useRef } from 'react';
import { GameScene } from './components/GameScene';
import { LEVELS } from './levels';
import { AudioController } from './utils/audio';

type GameState = 'START' | 'LOADING' | 'PLAYING' | 'TRANSITION' | 'WIN';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const audioControllerRef = useRef<AudioController | null>(null);

  // Initialize Audio Controller once
  useEffect(() => {
    audioControllerRef.current = new AudioController();
  }, []);

  const handleStartGame = async () => {
    // User interaction required to start Audio Context
    if (audioControllerRef.current) {
        await audioControllerRef.current.startZenMusic();
    }
    setGameState('LOADING');
    
    // Fake loading for aesthetics
    setTimeout(() => {
        setGameState('PLAYING');
    }, 2000);
  };

  const handleLevelComplete = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setGameState('TRANSITION');
    } else {
      setGameState('WIN');
    }
  };

  const nextLevel = () => {
    setCurrentLevelIdx(prev => prev + 1);
    setGameState('PLAYING');
  };

  const restartGame = () => {
    setCurrentLevelIdx(0);
    setGameState('PLAYING');
  };

  // --- SCREENS ---

  if (gameState === 'START') {
    return (
      <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-mono">
        {/* Background Visuals */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black animate-pulse"></div>
        
        <div className="z-10 text-center space-y-8 animate-in fade-in duration-1000 zoom-in-95">
            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-300 to-pink-200 tracking-[0.2em] drop-shadow-[0_0_25px_rgba(200,200,255,0.4)]">
                MINDPOINT
            </h1>
            <p className="text-purple-300/60 tracking-widest text-sm uppercase">A Journey of Perspective</p>
            
            <button 
                onClick={handleStartGame}
                className="group relative px-8 py-4 bg-transparent border border-purple-500/50 text-purple-100 uppercase tracking-[0.25em] text-xs hover:bg-purple-900/20 transition-all duration-500 overflow-hidden"
            >
                <span className="relative z-10 group-hover:text-white transition-colors">Enter Void</span>
                <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-purple-500/10"></div>
            </button>
            <p className="text-[10px] text-gray-600 mt-4">Headphones Recommended for Zen Experience</p>
        </div>
      </div>
    );
  }

  if (gameState === 'LOADING') {
      return (
        <div className="w-full h-screen bg-black flex flex-col items-center justify-center font-mono text-purple-200">
            <div className="w-16 h-16 border-t-2 border-l-2 border-purple-500 rounded-full animate-spin mb-8"></div>
            <p className="animate-pulse tracking-widest text-xs">CALIBRATING REALITY...</p>
        </div>
      );
  }

  if (gameState === 'WIN') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-black text-white font-mono relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1e1b4b_0%,_#000000_60%)]"></div>
        
        <div className="z-10 text-center animate-in slide-in-from-bottom-10 fade-in duration-1000">
            <h1 className="text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-t from-green-400 to-emerald-200 mb-6 font-bold tracking-widest drop-shadow-[0_0_20px_rgba(50,255,100,0.3)]">
                ENLIGHTENED
            </h1>
            <p className="mb-12 text-blue-200/50 tracking-widest text-sm">All perspectives have been aligned.</p>
            
            <button 
            onClick={restartGame}
            className="px-8 py-3 border border-emerald-500/30 text-emerald-100 hover:bg-emerald-900/20 hover:border-emerald-400 transition-all uppercase tracking-widest text-xs"
            >
            Journey Again
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <GameScene 
        level={LEVELS[currentLevelIdx]} 
        onLevelComplete={handleLevelComplete}
        audioController={audioControllerRef.current}
      />
      
      {/* Level Transition Overlay */}
      {gameState === 'TRANSITION' && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center font-mono animate-in fade-in duration-300">
               <h2 className="text-3xl text-white tracking-[0.3em] mb-2 font-light">ALIGNED</h2>
               <div className="w-12 h-[1px] bg-purple-500 mb-8"></div>
               <button 
                  onClick={nextLevel}
                  className="px-6 py-2 border border-white/20 text-white hover:bg-white hover:text-black transition-all uppercase tracking-widest text-xs"
               >
                   Ascend to Level {LEVELS[currentLevelIdx + 1]?.id}
               </button>
          </div>
      )}
    </div>
  );
};

export default App;