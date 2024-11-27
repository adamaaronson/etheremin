const A440 = 440;
const NOTES = [
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

export interface NoteLabel {
  noteName: (typeof NOTES)[number];
  y: number;
}

function getPitchNumber(frequency: number) {
  return Math.log(frequency / A440) / Math.log(2 ** (1 / 12));
}

function getFrequency(pitchNumber: number) {
  return A440 * (2 ** (1 / 12)) ** pitchNumber;
}

function getY(
  frequency: number,
  minFrequency: number,
  maxFrequency: number,
  minY: number,
  maxY: number
) {
  return (
    (Math.log(frequency / minFrequency) /
      Math.log(maxFrequency / minFrequency)) *
      (maxY - minY) +
    minY
  );
}

export function getNotesBetween(
  minFrequency: number,
  maxFrequency: number,
  minY: number,
  maxY: number
) {
  const notes: NoteLabel[] = [];

  const lowestNote = Math.ceil(getPitchNumber(minFrequency - 0.5));

  let currentNote = lowestNote;
  while (getFrequency(currentNote) < maxFrequency + 0.5) {
    notes.push({
      noteName: NOTES[((currentNote % 12) + 12) % 12],
      y: getY(
        getFrequency(currentNote),
        minFrequency,
        maxFrequency,
        minY,
        maxY
      ),
    });
    currentNote += 1;
  }

  return notes;
}
