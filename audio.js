const cues = {
  start: [440, 587],
  correct: [523, 659, 784],
  incorrect: [330, 247],
  finish: [523, 659, 784, 1047]
};

let context;

export function playCue(cue) {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;

  try {
    context ??= new Audio();
    if (context.state !== 'running') context.resume().catch(() => {});

    const start = context.currentTime;
    cues[cue].forEach((frequency, index) => {
      const time = start + index * 0.093;
      const tone = context.createOscillator();
      const volume = context.createGain();
      tone.type = 'sine';
      tone.frequency.value = frequency;
      volume.gain.setValueAtTime(0.001, time);
      volume.gain.exponentialRampToValueAtTime(0.085, time + 0.018);
      volume.gain.exponentialRampToValueAtTime(0.001, time + 0.21);
      tone.connect(volume);
      volume.connect(context.destination);
      tone.start(time);
      tone.stop(time + 0.22);
      tone.onended = () => {
        tone.disconnect();
        volume.disconnect();
      };
    });
  } catch {
    // The visual feedback also works in browsers without usable audio.
  }
}

export function muteCues() {
  if (context?.state === 'running') context.suspend().catch(() => {});
}
