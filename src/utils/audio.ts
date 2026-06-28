export const globalAudio = typeof window !== 'undefined' ? new Audio('/music.mp3') : null;

if (globalAudio) {
  globalAudio.loop = true;
}

export const playMusic = () => {
  if (globalAudio) {
    globalAudio.currentTime = 15;
    globalAudio.play().catch(e => console.error("Audio play failed:", e));
  }
};
