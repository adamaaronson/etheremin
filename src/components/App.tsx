import { useState } from "react";
import Etheremin from "./Etheremin";

export default function App() {
  const [started, setStarted] = useState(false);
  const [autotune, setAutotune] = useState(false);
  const [flats, setFlats] = useState(true);

  return (
    <div className="h-[100dvh] flex flex-col relative overflow-hidden">
      <header className="text-gray-100 font-mono absolute pointer-events-none select-none p-4 z-10">
        <h1 className="text-3xl font-bold m-0 p-0">etheremin</h1>
        <h2 className="text-1xl font-bold m-0 p-0">a window instrument</h2>
        <h2 className="text-1xl font-bold m-0 p-0">by adam aaronson</h2>
        <h2 className="text-1xl font-bold m-0 p-0">for guy dupont</h2>
      </header>
      {started ? (
        <Etheremin autotune={autotune} flats={flats} />
      ) : (
        <div className="absolute w-screen h-screen bg-gray-200 place-content-center text-center">
          <button
            className="font-mono bg-gray-200"
            onClick={() => setStarted(true)}
          >
            start playing
          </button>
        </div>
      )}
    </div>
  );
}
