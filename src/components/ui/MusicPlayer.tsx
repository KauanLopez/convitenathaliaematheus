import { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

import { globalAudio } from '../../utils/audio';

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    if (globalAudio) {
      globalAudio.addEventListener('play', handlePlay);
      globalAudio.addEventListener('pause', handlePause);
      setIsPlaying(!globalAudio.paused);
    }

    return () => {
      if (globalAudio) {
        globalAudio.removeEventListener('play', handlePlay);
        globalAudio.removeEventListener('pause', handlePause);
      }
    };
  }, []);

  const togglePlay = () => {
    if (!globalAudio) return;

    if (isPlaying) {
      globalAudio.pause();
    } else {
      globalAudio.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 1 }}
      onClick={togglePlay}
      className="fixed bottom-6 right-6 z-40 bg-bg-primary border-thin border-border-light p-4 rounded-full shadow-subtle text-text-main hover:bg-bg-secondary transition-colors"
      aria-label={isPlaying ? "Pausar música" : "Tocar música"}
    >
      {isPlaying ? (
        <Pause className="w-5 h-5" strokeWidth={1.5} />
      ) : (
        <Play className="w-5 h-5 pl-1" strokeWidth={1.5} />
      )}
    </motion.button>
  );
};
