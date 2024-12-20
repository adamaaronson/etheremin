import { useState } from "react";
import Notes from "./Notes";
import Circles from "./Circles";
import Debug from "./Debug";

const DEBUG = false;

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

export interface Wave {
  identifier: number;
  oscillator: OscillatorNode;
  gain: GainNode;
  playing: boolean;
  x: number;
  y: number;
}

export default function Etheremin({ autotune, flats }: EthereminProps) {
  const [waves, setWaves] = useState<Wave[]>([]);

  function getWave(identifier: number) {
    return waves.find((wave) => wave.identifier === identifier);
  }

  function deleteWave(identifier: number) {
    const wave = getWave(identifier);
    // if (!wave || wave.playing) {
    //   return;
    // }
    wave?.gain.disconnect();
    wave?.oscillator.disconnect();
    setWaves((waves) => waves.filter((wave) => wave.identifier !== identifier));
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

  function setVolume(gain: GainNode, x: number) {
    gain.gain.setTargetAtTime(
      getVolume(x),
      audioContext.currentTime,
      AUDIO_DELAY
    );
    return gain;
  }

  function setFrequency(oscillator: OscillatorNode, y: number) {
    oscillator.frequency.setValueAtTime(
      getFrequency(y),
      audioContext.currentTime
    );
    return oscillator;
  }

  function attack(identifier: number, x: number, y: number) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    oscillator.start(audioContext.currentTime);

    const wave: Wave = {
      identifier,
      oscillator: setFrequency(oscillator, y),
      gain: setVolume(gain, x),
      playing: true,
      x: x,
      y: y,
    };

    setWaves((oldWaves) => [...oldWaves, wave]);
  }

  function sustain(identifier: number, x: number, y: number) {
    setWaves((waves) =>
      waves.map((wave) =>
        wave.identifier === identifier
          ? {
              identifier: wave.identifier,
              oscillator: setFrequency(wave.oscillator, y),
              gain: setVolume(wave.gain, x),
              playing: wave.playing,
              x: x,
              y: y,
            }
          : wave
      )
    );
  }

  function release(identifier: number) {
    setWaves((waves) =>
      waves.map((wave) =>
        wave.identifier === identifier
          ? {
              identifier: wave.identifier,
              oscillator: wave.oscillator,
              gain: setVolume(wave.gain, MIN_VOL),
              playing: false,
              x: wave.x,
              y: wave.y,
            }
          : wave
      )
    );

    setTimeout(() => {
      deleteWave(identifier);
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
      {DEBUG && <Debug waves={waves} />}
      <Notes minFrequency={MIN_FREQ} maxFrequency={MAX_FREQ} flats={flats} />
      <Circles waves={waves} />
    </main>
  );
}
