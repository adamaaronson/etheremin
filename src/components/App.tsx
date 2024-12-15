import { useState } from "react";
import Etheremin from "./Etheremin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { motion } from "motion/react";
import Settings from "./Settings";

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
        <Settings
          autotune={autotune}
          setAutotune={setAutotune}
          flats={flats}
          setFlats={setFlats}
          setShowingMenu={setShowingMenu}
        />
      )}
      <Etheremin autotune={autotune} flats={flats} />
    </div>
  );
}
