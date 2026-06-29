export const globalAudio = typeof window !== 'undefined' ? new Audio('/music.mp3') : null;

if (globalAudio) {
  globalAudio.loop = true;
  globalAudio.volume = 0.8;
}

export const playMusic = () => {
  if (globalAudio) {
    globalAudio.currentTime = 13;
    globalAudio.play().catch(e => console.error("Audio play failed:", e));
  }
};
