import { useState } from "react";
import Etheremin from "./Etheremin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { motion } from "motion/react";
import Divider from "./Divider";

export default function App() {
  const [showingMenu, setShowingMenu] = useState(true);
  const [autotune, setAutotune] = useState(false);
  const [flats, setFlats] = useState(true);

  function openMenu() {
    setShowingMenu(true);
  }

  return (
    <div className="h-[100dvh] flex flex-col relative overflow-hidden">
      <header className="text-gray-100 font-mono absolute pointer-events-none select-none p-4 z-20">
        <div
          className="leading-none font-bold m-0 p-0 font-retro flex flex-row items-center gap-[0.3em]"
          style={{ fontSize: "min(3rem, 10vw)" }}
        >
          <motion.div
            className="z-30 pointer-events-auto cursor-pointer leading-[0.63] mt-[0.1em]"
            onClick={openMenu}
            whileHover={{ rotate: 360, transition: { duration: 1 } }}
          >
            <FontAwesomeIcon
              icon={faGear}
              className="text-[0.6em] mb-[0.1em]"
            />
          </motion.div>
          <span>etheremin</span>
        </div>
      </header>
      {showingMenu && (
        <div
          className="absolute w-screen h-screen bg-[rgb(0,0,0,0.5)] place-content-center text-center z-50 flex items-center content-center text-gray-600 "
          onClick={() => setShowingMenu(false)}
        >
          <div
            className="bg-gray-200 p-6 font-mono flex flex-col shadow-lg m-4 max-h-screen overflow-scroll"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h2 className="text-2xl leading-none mb-2">
              welcome to <span className="font-retro">etheremin</span>
            </h2>
            <p>a new musical instrument</p>
            <Divider />
            <p>click and drag to play</p>
            <p>move up and down for pitch</p>
            <p>move left and right for volume</p>
            <Divider />
            <p>
              autotune:{" "}
              <span
                className="cursor-pointer"
                style={{ fontWeight: autotune ? "normal" : "bold" }}
                onClick={() => setAutotune(false)}
              >
                off
              </span>{" "}
              /{" "}
              <span
                className="cursor-pointer"
                style={{ fontWeight: autotune ? "bold" : "normal" }}
                onClick={() => setAutotune(true)}
              >
                on
              </span>
            </p>
            <p>
              notes:{" "}
              <span
                className="cursor-pointer"
                style={{ fontWeight: flats ? "bold" : "normal" }}
                onClick={() => setFlats(true)}
              >
                flats
              </span>{" "}
              /{" "}
              <span
                className="cursor-pointer"
                style={{ fontWeight: flats ? "normal" : "bold" }}
                onClick={() => setFlats(false)}
              >
                sharps
              </span>
            </p>
            <Divider />
            <button
              className="font-mono font-bold text-gray-100 bg-gray-500 p-3 hover:bg-gray-400 hover:text-gray-100 px-6 mb-4"
              onClick={() => setShowingMenu(false)}
            >
              start playing
            </button>
            <p className="text-sm">
              by{" "}
              <a
                href="https://aaronson.org"
                target="_blank"
                className="hover:text-gray-400 font-bold"
              >
                adam aaronson
              </a>{" "}
              / for{" "}
              <a
                href="https://www.guycombinator.net"
                target="_blank"
                className="hover:text-gray-400 font-bold"
              >
                guy dupont
              </a>
            </p>
          </div>
        </div>
      )}
      <Etheremin autotune={autotune} flats={flats} />
    </div>
  );
}
