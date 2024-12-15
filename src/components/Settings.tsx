import Divider from "./Divider";

interface SettingsProps {
  autotune: boolean;
  setAutotune: (autotune: boolean) => void;
  flats: boolean;
  setFlats: (flats: boolean) => void;
  setShowingMenu: (showingMenu: boolean) => void;
}

export default function Settings({
  autotune,
  setAutotune,
  flats,
  setFlats,
  setShowingMenu,
}: SettingsProps) {
  return (
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
        <p className="text-sm">make sure your volume is on</p>
        <button
          className="font-mono font-bold text-gray-100 bg-gray-500 p-3 hover:bg-gray-400 hover:text-gray-100 px-6 my-4"
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
  );
}
