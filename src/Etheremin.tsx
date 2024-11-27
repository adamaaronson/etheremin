import { useEffect, useState } from "react";
import { getNotesBetween } from "./Notes";

const MIN_FREQ = 220;
const MAX_FREQ = 880;
const MIN_VOL = 0;
const MAX_VOL = 1;

const AUDIO_DELAY = 0.1;

export default function Etheremin() {
  const [audioContext, setAudioContext] = useState(() => new AudioContext());
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  const [gain, setGain] = useState<GainNode | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // https://marcgg.com/blog/2016/11/01/javascript-audio/
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    gainNode.gain.setValueAtTime(0, context.currentTime);
    oscillator.start(context.currentTime);

    setAudioContext(audioContext);
    setOscillator(oscillator);
    setGain(gainNode);
  }, []);

  function getVolume(x: number) {
    return (MAX_VOL - MIN_VOL) * (x / window.innerWidth) + MIN_VOL;
  }

  function getFrequency(y: number) {
    return (
      2 ** (Math.log2(MAX_FREQ / MIN_FREQ) * (1 - y / window.innerHeight)) *
      MIN_FREQ
    );
  }

  function attack(event: React.MouseEvent<HTMLElement>) {
    if (!gain) {
      return;
    }

    gain.gain.linearRampToValueAtTime(
      getVolume(event.clientX),
      audioContext.currentTime + AUDIO_DELAY
    );

    if (oscillator) {
      oscillator.frequency.setValueAtTime(
        getFrequency(event.clientY),
        audioContext.currentTime
      );
    }

    setPlaying(true);
  }

  function release(event: React.MouseEvent<HTMLElement>) {
    if (gain) {
      gain.gain.linearRampToValueAtTime(
        MIN_VOL,
        audioContext.currentTime + AUDIO_DELAY
      );
    }

    setPlaying(false);
  }

  function sustain(event: React.MouseEvent<HTMLElement>) {
    if (!playing) {
      return;
    }
    if (gain) {
      gain.gain.linearRampToValueAtTime(
        getVolume(event.clientX),
        audioContext.currentTime + AUDIO_DELAY
      );
    }
    if (oscillator) {
      oscillator.frequency.setValueAtTime(
        getFrequency(event.clientY),
        audioContext.currentTime
      );
    }
  }

  return (
    <main
      className="bg-gray-400 flex-1 cursor-pointer overflow-hidden"
      onMouseDown={(event) => attack(event)}
      onMouseUp={(event) => release(event)}
      onMouseMove={(event) => sustain(event)}
      onMouseLeave={(event) => release(event)}
      // onTouchStart={(event) => attack(event)}
      // onTouchEnd={(event) => release(event)}
      // onTouchMove={(event) => sustain(event)}
    >
      {getNotesBetween(MIN_FREQ, MAX_FREQ, 0, window.innerHeight).map(
        ({ noteName, y }) => (
          <span
            className="text-gray-100 absolute w-screen right-100 text-right pr-4 font-mono font-bold text-2xl -translate-y-1/2"
            style={{ top: `${window.innerHeight - y}px` }}
          >
            {noteName}
            {noteName.length === 1 ? "\u00A0" : ""}
          </span>
        )
      )}
    </main>
  );
}
