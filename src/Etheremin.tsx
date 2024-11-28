import { useEffect, useState } from "react";
import Notes from "./Notes";

const MIN_FREQ = 220;
const MAX_FREQ = 880;
const MIN_VOL = 0;
const MAX_VOL = 1;

const AUDIO_DELAY = 0.1;

export interface EthereminProps {
  autotune: boolean;
  flats: boolean;
}

export default function Etheremin({ autotune, flats }: EthereminProps) {
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
    if (autotune) {
      return (
        2 **
          (Math.round(
            Math.log2(MAX_FREQ / MIN_FREQ) * (1 - y / window.innerHeight) * 12
          ) /
            12) *
        MIN_FREQ
      );
    }
    return (
      2 ** (Math.log2(MAX_FREQ / MIN_FREQ) * (1 - y / window.innerHeight)) *
      MIN_FREQ
    );
  }

  function setVolume(volume: number) {
    if (gain) {
      gain.gain.linearRampToValueAtTime(
        getVolume(volume),
        audioContext.currentTime + AUDIO_DELAY
      );
    }
  }

  function setFrequency(frequency: number) {
    if (oscillator) {
      oscillator.frequency.setValueAtTime(
        getFrequency(frequency),
        audioContext.currentTime
      );
    }
  }

  function attack(event: React.MouseEvent<HTMLElement>) {
    setVolume(event.clientX);
    setFrequency(event.clientY);
    setPlaying(true);
  }

  function release(event: React.MouseEvent<HTMLElement>) {
    setVolume(MIN_VOL);
    setPlaying(false);
  }

  function sustain(event: React.MouseEvent<HTMLElement>) {
    if (playing) {
      setVolume(event.clientX);
      setFrequency(event.clientY);
    }
  }

  function attackTouch(event: React.TouchEvent<HTMLElement>) {
    setVolume(event.touches[0].clientX);
    setFrequency(event.touches[0].clientY);
    setPlaying(true);
  }

  function releaseTouch(event: React.TouchEvent<HTMLElement>) {
    setVolume(MIN_VOL);
    setPlaying(false);
  }

  function sustainTouch(event: React.TouchEvent<HTMLElement>) {
    if (playing) {
      setVolume(event.touches[0].clientX);
      setFrequency(event.touches[0].clientY);
    }
  }

  return (
    <main
      className="bg-gray-400 flex-1 cursor-pointer overflow-hidden"
      onMouseDown={(event) => attack(event)}
      onMouseUp={(event) => release(event)}
      onMouseMove={(event) => sustain(event)}
      onMouseLeave={(event) => release(event)}
      onTouchStart={(event) => attackTouch(event)}
      onTouchEnd={(event) => releaseTouch(event)}
      onTouchMove={(event) => sustainTouch(event)}
    >
      <Notes minFrequency={MIN_FREQ} maxFrequency={MAX_FREQ} flats={flats} />
    </main>
  );
}
