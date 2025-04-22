export interface Note {
  id: string;
  startTime: number;  // in milliseconds
  duration: number;   // in milliseconds
  chord: string;      // e.g. "Em", "G", "D"
  isStrum?: boolean;  // if false, it's a single note/pick
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tempo: number;      // BPM
  timeSignature: string; // e.g. "4/4"
  notes: Note[];
  thumbnailUrl?: string;
  duration: number;   // total song duration in milliseconds
  chords: string[];   // list of core chords used in the song
}

export interface SongProgress {
  correctNotes: number;
  totalNotes: number;
  accuracy: number;
  currentStreak: number;
  maxStreak: number;
  timeElapsed: number;
} 