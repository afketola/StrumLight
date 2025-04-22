import { generateId } from '../utils/helpers';

export interface SongNote {
  id: string;
  startTime: number; // in milliseconds
  duration: number; // in milliseconds
  chord: string;
  finger?: number; // Added finger position
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tempo: number; // BPM
  timeSignature: string;
  duration: number; // in milliseconds
  thumbnailUrl: string;
  chords: string[];
  notes: SongNote[];
}

export const songs: Song[] = [
  {
    id: generateId(),
    title: "Wagon Wheel",
    artist: "Old Crow Medicine Show",
    difficulty: "Beginner",
    tempo: 120,
    timeSignature: "4/4",
    duration: 60000, // 60 seconds
    thumbnailUrl: require('../assets/images/strummy.png'),
    chords: ["G_Major", "D_Major", "E_Minor", "C_Major"],
    notes: [
      { id: generateId(), startTime: 0, duration: 4000, chord: "G_Major", finger: 1 },
      { id: generateId(), startTime: 4000, duration: 4000, chord: "D_Major", finger: 2 },
      { id: generateId(), startTime: 8000, duration: 4000, chord: "E_Minor", finger: 2 },
      { id: generateId(), startTime: 12000, duration: 4000, chord: "C_Major", finger: 1 },
      // Repeat pattern
      { id: generateId(), startTime: 16000, duration: 4000, chord: "G_Major", finger: 1 },
      { id: generateId(), startTime: 20000, duration: 4000, chord: "D_Major", finger: 2 },
      { id: generateId(), startTime: 24000, duration: 4000, chord: "E_Minor", finger: 2 },
      { id: generateId(), startTime: 28000, duration: 4000, chord: "C_Major", finger: 1 }
    ]
  },
  {
    id: generateId(),
    title: "Smoke on the Water",
    artist: "Deep Purple",
    difficulty: "Beginner",
    tempo: 115,
    timeSignature: "4/4",
    duration: 60000, // 60 seconds
    thumbnailUrl: require('../assets/images/strummy.png'),
    chords: ["G_Major", "Bb_Major", "C_Major"],
    notes: [
      { id: generateId(), startTime: 0, duration: 3000, chord: "G_Major", finger: 1 },
      { id: generateId(), startTime: 3000, duration: 3000, chord: "Bb_Major", finger: 3 },
      { id: generateId(), startTime: 6000, duration: 3000, chord: "C_Major", finger: 3 },
      // Repeat
      { id: generateId(), startTime: 9000, duration: 3000, chord: "G_Major", finger: 1 },
      { id: generateId(), startTime: 12000, duration: 3000, chord: "Bb_Major", finger: 3 },
      { id: generateId(), startTime: 15000, duration: 3000, chord: "C_Major", finger: 3 }
    ]
  },
  {
    id: generateId(),
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    difficulty: "Intermediate",
    tempo: 126,
    timeSignature: "4/4",
    duration: 60000, // 60 seconds
    thumbnailUrl: require('../assets/images/strummy.png'),
    chords: ["D_Major", "C_Major", "G_Major", "A_Major"],
    notes: [
      { id: generateId(), startTime: 0, duration: 4000, chord: "D_Major", finger: 1 },
      { id: generateId(), startTime: 4000, duration: 4000, chord: "C_Major", finger: 2 },
      { id: generateId(), startTime: 8000, duration: 4000, chord: "G_Major", finger: 3 },
      { id: generateId(), startTime: 12000, duration: 4000, chord: "A_Major", finger: 2 },
      // Repeat
      { id: generateId(), startTime: 16000, duration: 4000, chord: "D_Major", finger: 1 },
      { id: generateId(), startTime: 20000, duration: 4000, chord: "C_Major", finger: 2 },
      { id: generateId(), startTime: 24000, duration: 4000, chord: "G_Major", finger: 3 },
      { id: generateId(), startTime: 28000, duration: 4000, chord: "A_Major", finger: 2 }
    ]
  }
]; 