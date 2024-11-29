import { useEffect, useState } from "react";
import Notes from "./Notes";

const MIN_FREQ = 220;
const MAX_FREQ = 880;
const MIN_VOL = 0;
const MAX_VOL = 1;

const AUDIO_DELAY = 0.025;
const MOUSE_ID = 47;

const audioContext = new AudioContext();

export interface EthereminProps {
  autotune: boolean;
  flats: boolean;
}

interface Wave {
  oscillator: OscillatorNode;
  gain: GainNode;
  playing: boolean;
}

export default function Etheremin({ autotune, flats }: EthereminProps) {
  const [waves, setWaves] = useState<Map<number, Wave>>(new Map());

  function makeWave(identifier: number) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    oscillator.start(audioContext.currentTime);

    const wave: Wave = {
      oscillator: oscillator,
      gain: gain,
      playing: false,
    };

    setWaves(new Map(waves.set(identifier, wave)));
    return wave;
  }

  function deleteWave(identifier: number) {
    const wave = waves.get(identifier);
    waves.delete(identifier);
    wave?.gain.disconnect();
    wave?.oscillator.disconnect();
  }

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

  function setVolume(identifier: number, x: number) {
    const wave = waves.get(identifier) || makeWave(identifier);
    wave.gain.gain.setTargetAtTime(
      getVolume(x),
      audioContext.currentTime,
      AUDIO_DELAY
    );
  }

  function setFrequency(identifier: number, y: number) {
    const wave = waves.get(identifier) || makeWave(identifier);
    wave.oscillator.frequency.setValueAtTime(
      getFrequency(y),
      audioContext.currentTime
    );
  }

  function setPlaying(identifier: number, playing: boolean) {
    const wave = waves.get(identifier) || makeWave(identifier);
    wave.playing = playing;
  }

  function attackMouse(event: React.MouseEvent<HTMLElement>) {
    setVolume(MOUSE_ID, event.clientX);
    setFrequency(MOUSE_ID, event.clientY);
    setPlaying(MOUSE_ID, true);
  }

  function releaseMouse(event: React.MouseEvent<HTMLElement>) {
    setVolume(MOUSE_ID, MIN_VOL);
    setPlaying(MOUSE_ID, false);
  }

  function sustainMouse(event: React.MouseEvent<HTMLElement>) {
    if (waves.get(MOUSE_ID)?.playing) {
      setVolume(MOUSE_ID, event.clientX);
      setFrequency(MOUSE_ID, event.clientY);
    }
  }

  function attackTouch(event: React.TouchEvent<HTMLElement>) {
    event.preventDefault();
    const touches = event.touches;
    for (let i = 0; i < touches.length; i++) {
      const identifier = touches[i].identifier;
      setVolume(identifier, touches[i].clientX);
      setFrequency(identifier, touches[i].clientY);
      setPlaying(identifier, true);
    }
  }

  function releaseTouch(event: React.TouchEvent<HTMLElement>) {
    event.preventDefault();
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const identifier = touches[i].identifier;
      setVolume(identifier, MIN_VOL);
      setPlaying(identifier, false);
      setTimeout(() => {
        deleteWave(identifier);
      }, AUDIO_DELAY * 10000);
    }
  }

  function sustainTouch(event: React.TouchEvent<HTMLElement>) {
    event.preventDefault();
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const identifier = touches[i].identifier;
      setVolume(identifier, touches[i].clientX);
      setFrequency(identifier, touches[i].clientY);
    }
  }

  return (
    <main
      className="bg-gray-400 flex-1 cursor-pointer overflow-hidden"
      onMouseDown={(event) => attackMouse(event)}
      onMouseUp={(event) => releaseMouse(event)}
      onMouseLeave={(event) => releaseMouse(event)}
      onMouseMove={(event) => sustainMouse(event)}
      onTouchStart={(event) => attackTouch(event)}
      onTouchEnd={(event) => releaseTouch(event)}
      onTouchMove={(event) => sustainTouch(event)}
    >
      {/* {Array.from(waves.entries()).map(([identifier, wave]) => (
        <p>
          {identifier}: ({wave.oscillator.frequency.value},{" "}
          {wave.gain.gain.value})
        </p>
      ))} */}
      <Notes minFrequency={MIN_FREQ} maxFrequency={MAX_FREQ} flats={flats} />
    </main>
  );
}
