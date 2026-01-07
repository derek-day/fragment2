"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  SkipBack, 
  Music,
  Minimize2,
  Maximize2
} from "lucide-react";

export default function BackgroundMusic({ 
  tracks = [], 
  initialVolume = 0.3,
  autoPlay = true // Default set to true
}) {
  const audioRef = useRef(null);
  
  // 1. Set default state to Minimized
  const [isMinimized, setIsMinimized] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Handle Play/Pause Toggle
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((error) => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
          });
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const changeTrack = (direction) => {
    let newIndex = currentTrackIndex + direction;
    if (newIndex < 0) newIndex = tracks.length - 1;
    if (newIndex >= tracks.length) newIndex = 0;
    setCurrentTrackIndex(newIndex);
  };

  // Effect: Handle Track Switching
  useEffect(() => {
    if (!audioRef.current) return;
    
    // If track index changes, reload and play if we were already playing
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play()
        .catch(e => console.log("Track switch play prevented:", e));
    } else {
      // Just load the new source if we are paused
      audioRef.current.load();
    }
  }, [currentTrackIndex]);

  // Effect: Initial Mount (Autoplay Logic)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;

      if (autoPlay) {
        // 2. Attempt to play immediately
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Success: Audio is playing
              setIsPlaying(true);
            })
            .catch((error) => {
              // Failure: Browser blocked autoplay (User hasn't clicked yet)
              console.log("Autoplay blocked by browser policy. Waiting for user interaction.");
              setIsPlaying(false);
            });
        }
      }
    }
  }, []); // Run once on mount

  // Effect: Handle Song End (Loop/Next)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => changeTrack(1);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [currentTrackIndex]);

  if (!tracks || tracks.length === 0) return null;

  const currentTrack = tracks[currentTrackIndex];

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-4 z-50 flex flex-col items-end pointer-events-none"
    >
      <audio ref={audioRef} src={currentTrack.src} preload="auto" />

      <motion.div 
        layout
        className="pointer-events-auto bg-gray-900/90 backdrop-blur-md border border-gray-700 shadow-2xl overflow-hidden"
        // Animate width based on minimized state
        animate={{ 
          width: isMinimized ? "auto" : "300px" 
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header / Minimized View */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 border-b border-gray-700/50">
          
          <div className="flex items-center gap-3 overflow-hidden">
            {/* Rotating Icon */}
            {/* <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className={isPlaying ? "text-blue-400" : "text-gray-500"}
            >
              <Music size={18} />
            </motion.div> */}
            
            {/* Marquee Text (Only visible if expanded OR if you want it in minimized) */}
            <AnimatePresence mode="wait">
              {!isMinimized && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col"
                >
                  <span className="text-sm font-bold text-white truncate max-w-[150px]">
                    {currentTrack.title}
                  </span>
                  <span className="text-[10px] text-blue-300">
                    {isPlaying ? "Now Playing" : "Paused"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Play/Pause in Minimized Mode */}
            {isMinimized && (
              <button 
                onClick={togglePlay}
                className="text-white hover:text-blue-400 transition-colors p-1"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
            )}
            
            {/* Maximize/Minimize Toggle */}
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
          </div>
        </div>

        {/* Expanded Controls */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 space-y-4 bg-gradient-to-b from-gray-900 to-black"
            >
              {/* Playback Controls */}
              <div className="flex justify-center items-center gap-6">
                <button 
                  onClick={() => changeTrack(-1)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <SkipBack size={24} />
                </button>

                <button 
                  onClick={togglePlay}
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-full p-4 shadow-lg shadow-blue-900/50 transition-transform active:scale-95 border border-blue-400"
                >
                  {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
                </button>

                <button 
                  onClick={() => changeTrack(1)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <SkipForward size={24} />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={() => setVolume(volume === 0 ? 0.3 : 0)} 
                  className="text-gray-400 hover:text-white"
                >
                   {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-blue-400"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}