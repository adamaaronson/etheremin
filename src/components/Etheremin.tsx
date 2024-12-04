import { useState } from "react";
import Notes from "./Notes";

const MIN_FREQ = 220;
const MAX_FREQ = 880;
const MIN_VOL = 0;
const MAX_VOL = 1;

const AUDIO_DELAY = 0.025;
let MOUSE_ID = 47;

const audioContext = new AudioContext();

export interface EthereminProps {
  autotune: boolean;
  flats: boolean;
}

interface Wave {
  oscillator: OscillatorNode;
  gain: GainNode;
  playing: boolean;
  x: number;
  y: number;
}

export default function Etheremin({ autotune, flats }: EthereminProps) {
  const [waves, setWaves] = useState<Map<number, Wave>>(new Map());
  const [_timestamp, setTimestamp] = useState(0);

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
      x: 0,
      y: 0,
    };

    setWaves(new Map(waves.set(identifier, wave)));
    return wave;
  }

  function deleteWave(identifier: number) {
    const wave = waves.get(identifier);
    if (!wave || wave.playing) {
      return;
    }
    wave?.gain.disconnect();
    wave?.oscillator.disconnect();
    setWaves((waves) => {
      waves.delete(identifier);
      return waves;
    });
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

  function setCoordinates(identifier: number, x: number, y: number) {
    const wave = waves.get(identifier) || makeWave(identifier);
    wave.x = x;
    wave.y = y;
  }

  function attack(identifier: number, x: number, y: number) {
    setVolume(identifier, x);
    setFrequency(identifier, y);
    setPlaying(identifier, true);
    setCoordinates(identifier, x, y);
    setTimestamp(Date.now());
  }

  function sustain(identifier: number, x: number, y: number) {
    if (waves.get(identifier)?.playing) {
      setVolume(identifier, x);
      setFrequency(identifier, y);
      setCoordinates(identifier, x, y);
      setTimestamp(Date.now());
    }
  }

  function release(identifier: number) {
    setVolume(identifier, MIN_VOL);
    setPlaying(identifier, false);
    setTimestamp(Date.now());
    setTimeout(() => {
      deleteWave(identifier);
      setTimestamp(Date.now());
    }, AUDIO_DELAY * 5000);
  }

  function attackMouse(event: React.MouseEvent<HTMLElement>) {
    attack(MOUSE_ID, event.clientX, event.clientY);
  }

  function sustainMouse(event: React.MouseEvent<HTMLElement>) {
    sustain(MOUSE_ID, event.clientX, event.clientY);
  }

  function releaseMouse(_event: React.MouseEvent<HTMLElement>) {
    release(MOUSE_ID);
    MOUSE_ID += 1;
  }

  function attackTouch(event: React.TouchEvent<HTMLElement>) {
    event.preventDefault();
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      attack(touch.identifier, touch.clientX, touch.clientY);
    }
  }

  function sustainTouch(event: React.TouchEvent<HTMLElement>) {
    event.preventDefault();
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      sustain(touch.identifier, touch.clientX, touch.clientY);
    }
  }

  function releaseTouch(event: React.TouchEvent<HTMLElement>) {
    event.preventDefault();
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      release(touch.identifier);
    }
  }

  return (
    <main
      className="bg-gray-400 flex-1 cursor-pointer overflow-hidden"
      onMouseDown={(event) => attackMouse(event)}
      onMouseMove={(event) => sustainMouse(event)}
      onMouseUp={(event) => releaseMouse(event)}
      onMouseLeave={(event) => releaseMouse(event)}
      onTouchStart={(event) => attackTouch(event)}
      onTouchMove={(event) => sustainTouch(event)}
      onTouchEnd={(event) => releaseTouch(event)}
    >
      <Notes minFrequency={MIN_FREQ} maxFrequency={MAX_FREQ} flats={flats} />
      {Array.from(waves.entries()).map(([identifier, wave]) => (
        <div
          className="absolute bg-gray-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-0"
          key={identifier}
          style={{
            left: wave.x,
            top: wave.y,
            width: `${(wave.x / window.innerWidth) * 15}dvh`,
            height: `${(wave.x / window.innerWidth) * 15}dvh`,
          }}
        ></div>
      ))}
    </main>
  );
}
