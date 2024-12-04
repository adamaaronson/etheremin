const A440 = 440;
const FLATS = [
  "A",
  "Bb",
  "B",
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
] as const;

const SHARPS = [
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
] as const;

export interface NoteLabel {
  noteName: (typeof FLATS)[number] | (typeof SHARPS)[number];
  y: number;
}

function getPitchNumber(frequency: number) {
  return Math.log(frequency / A440) / Math.log(2 ** (1 / 12));
}

function getFrequency(pitchNumber: number) {
  return A440 * (2 ** (1 / 12)) ** pitchNumber;
}

function getY(frequency: number, minFrequency: number, maxFrequency: number) {
  return (
    Math.log(frequency / minFrequency) / Math.log(maxFrequency / minFrequency)
  );
}

export function getNotesBetween(
  minFrequency: number,
  maxFrequency: number,
  flats: boolean = true
) {
  const notes: NoteLabel[] = [];

  const lowestNote = Math.ceil(getPitchNumber(minFrequency - 0.5));

  let currentNote = lowestNote;
  while (getFrequency(currentNote) < maxFrequency + 0.5) {
    notes.push({
      noteName: (flats ? FLATS : SHARPS)[((currentNote % 12) + 12) % 12],
      y: getY(getFrequency(currentNote), minFrequency, maxFrequency),
    });
    currentNote += 1;
  }

  return notes;
}

interface NotesProps {
  minFrequency: number;
  maxFrequency: number;
  flats: boolean;
}

export default function Notes({
  minFrequency,
  maxFrequency,
  flats,
}: NotesProps) {
  const notes = getNotesBetween(minFrequency, maxFrequency, flats);
  const dy = notes[1].y - notes[0].y;
  return getNotesBetween(minFrequency, maxFrequency, flats).map(
    ({ noteName, y }, index) => (
      <div
        className="text-gray-100 absolute w-screen right-100 text-right pr-4 font-mono font-bold -translate-y-1/2 select-none
        border-t border-t-[#bbbbbb] z-[5] flex flex-row justify-end items-center"
        style={{
          height: `${100 * dy}dvh`,
          top: `${100 - 100 * y}dvh`,
          fontSize: `${80 * dy}dvh`,
        }}
        key={index}
      >
        <span>
          {noteName}
          {noteName.length === 1 ? "\u00A0" : ""}
        </span>
      </div>
    )
  );
}
