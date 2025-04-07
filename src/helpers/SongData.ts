// src/helpers/SongData.ts
export interface NoteEvent {
    startTime: number;   // seconds into the audio track
    duration: number;    // how long the note is held
    pitch: string;       // e.g., “E3” or “B2” (if relevant)
    chordName?: string;  // e.g., “E Minor” if it’s a chord
  }
  
  export interface SongSection {
    measure: number;
    notes: NoteEvent[];
    pauseAtEnd?: boolean;  // if true, we pause after this measure
  }
  
  // Example snippet of Enter Sandman
  export const enterSandmanData: SongSection[] = [
    {
      measure: 1,
      notes: [
        { startTime: 0.0, duration: 1.0, pitch: "E3", chordName: "E Minor" },
        { startTime: 1.0, duration: 1.0, pitch: "G3" },
      ],
      pauseAtEnd: true,
    },
    {
      measure: 2,
      notes: [
        { startTime: 2.0, duration: 1.0, pitch: "A3" },
        { startTime: 3.0, duration: 1.0, pitch: "G3" },
      ],
      pauseAtEnd: false,
    },
    // more measures...
  ];
  