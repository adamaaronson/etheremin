import { Wave } from "./Etheremin";

interface DebugProps {
  waves: Wave[];
}

export default function Debug({ waves }: DebugProps) {
  return (
    <div className="absolute mt-[5rem]">
      {waves.map((wave) => (
        <div>
          {wave.identifier}: {wave.gain.gain.value},{" "}
          {wave.playing ? "true" : "false"}
        </div>
      ))}
    </div>
  );
}
