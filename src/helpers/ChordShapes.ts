// src/helpers/chordShapes.ts

export interface ChordStringInfo {
    fret: number;  // -1 => X, 0 => O, 1..n => finger fret
  }
  
  // Helper function to convert an LED array (from chord_library.h) into fret info
  function ledToFrets(ledArray: number[]): number[] {
    // [LowE(0), A(1), D(2), G(3), B(4), HighE(5)]
    return ledArray.map(ledVal => {
      if (ledVal === -1) return -1; // X
      if (ledVal === 10) return 0;  // O
      return 10 - ledVal;          // e.g. 8 => (10-8)=2
    });
  }
  
  /** 
   * Full chordShapes dictionary: 
   * Keys match the `chord.name` from chord_library.h,
   * Values are the resulting 6-string array after LED → fret conversion.
   */
  
  // --------------------------------
  // A GROUP
  // --------------------------------
  export const chordShapes: Record<string, ChordStringInfo[]> = {
    "A Major": ledToFrets([-1,10,8,8,8,10]).map(f => ({ fret: f })),
    "A Minor": ledToFrets([-1,10,8,8,7,10]).map(f => ({ fret: f })),
    "A 7":     ledToFrets([-1,10,8,10,8,10]).map(f => ({ fret: f })),
    "A Dim":   ledToFrets([-1,10,9,8,9,10]).map(f => ({ fret: f })),
    "A Dim7":  ledToFrets([8,-1,9,8,9,-1]).map(f => ({ fret: f })),
    "A Aug":   ledToFrets([-1,10,7,8,8,9]).map(f => ({ fret: f })),
    "A Sus2":  ledToFrets([-1,10,8,8,10,10]).map(f => ({ fret: f })),
    "A Sus4":  ledToFrets([-1,10,8,8,7,10]).map(f => ({ fret: f })),
    "A maj7":  ledToFrets([-1,10,8,9,8,10]).map(f => ({ fret: f })),
    "A m7":    ledToFrets([-1,10,8,10,9,10]).map(f => ({ fret: f })),
    "A 7sus4": ledToFrets([-1,10,8,10,7,10]).map(f => ({ fret: f })),
  
    // --------------------------------
    // B GROUP
    // --------------------------------
    "B Major": ledToFrets([-1,8,6,6,6,8]).map(f => ({ fret: f })),
    "B Minor": ledToFrets([-1,8,6,6,7,8]).map(f => ({ fret: f })),
    "B 7":     ledToFrets([-1,8,6,8,10,8]).map(f => ({ fret: f })),
    "B Dim":   ledToFrets([-1,8,7,6,7,-1]).map(f => ({ fret: f })),
    "B Dim7":  ledToFrets([9,0,10,9,10,0]).map(f => ({ fret: f })),  // => see note if e.g. 0 means O 
    "B Aug":   ledToFrets([3,4,5,10,10,-1]).map(f => ({ fret: f })),
    "B Sus2":  ledToFrets([-1,8,6,6,8,8]).map(f => ({ fret: f })),
    "B Sus4":  ledToFrets([-1,8,6,6,5,8]).map(f => ({ fret: f })),
    "B maj7":  ledToFrets([-1,-1,9,7,10,8]).map(f => ({ fret: f })),
    "B m7":    ledToFrets([-1,10,10,8,10,8]).map(f => ({ fret: f })),
    "B 7sus4": ledToFrets([-1,8,6,8,5,8]).map(f => ({ fret: f })),
  
    // --------------------------------
    // C GROUP
    // --------------------------------
    "C Major": ledToFrets([-1,7,8,10,9,10]).map(f => ({ fret: f })),
    "C Minor": ledToFrets([-1,7,9,10,9,7]).map(f => ({ fret: f })),
    "C 7":     ledToFrets([-1,7,8,7,9,10]).map(f => ({ fret: f })),
    "C Dim":   ledToFrets([-1,7,6,5,6,-1]).map(f => ({ fret: f })),
    "C Dim7":  ledToFrets([8,-1,9,8,9,-1]).map(f => ({ fret: f })),
    "C Aug":   ledToFrets([-1,7,8,9,9,10]).map(f => ({ fret: f })),
    "C Sus2":  ledToFrets([-1,7,5,5,7,7]).map(f => ({ fret: f })),
    "C Sus4":  ledToFrets([-1,7,7,10,9,-1]).map(f => ({ fret: f })),
    "C maj7":  ledToFrets([-1,-1,8,6,9,7]).map(f => ({ fret: f })),
    "C m7":    ledToFrets([-1,7,9,7,9,-1]).map(f => ({ fret: f })),
    "C 7sus4": ledToFrets([-1,7,5,7,4,7]).map(f => ({ fret: f })),
  
    // --------------------------------
    // D GROUP
    // --------------------------------
    "D Major": ledToFrets([-1,-1,10,8,7,8]).map(f => ({ fret: f })),
    "D Minor": ledToFrets([-1,-1,10,8,7,9]).map(f => ({ fret: f })),
    "D 7":     ledToFrets([-1,-1,10,8,9,8]).map(f => ({ fret: f })),
    "D Dim":   ledToFrets([-1,5,4,3,4,-1]).map(f => ({ fret: f })),
    "D Dim7":  ledToFrets([-1,-1,10,9,10,9]).map(f => ({ fret: f })),
    "D Aug":   ledToFrets([-1,-1,10,7,7,8]).map(f => ({ fret: f })),
    "D Sus2":  ledToFrets([-1,-1,10,8,7,10]).map(f => ({ fret: f })),
    "D Sus4":  ledToFrets([-1,-1,10,8,7,7]).map(f => ({ fret: f })),
    "D maj7":  ledToFrets([-1,-1,10,8,8,8]).map(f => ({ fret: f })),
    "D m7":    ledToFrets([-1,-1,10,8,9,9]).map(f => ({ fret: f })),
    "D 7sus4": ledToFrets([-1,-1,10,8,9,7]).map(f => ({ fret: f })),
  
    // --------------------------------
    // E GROUP
    // --------------------------------
    "E Major": ledToFrets([10,8,8,9,10,10]).map(f => ({ fret: f })),
    "E Minor": ledToFrets([10,8,8,10,10,10]).map(f => ({ fret: f })),
    "E 7":     ledToFrets([10,8,10,9,10,8]).map(f => ({ fret: f })),
    "E Dim":   ledToFrets([10,9,8,10,-1,-1]).map(f => ({ fret: f })),
    "E Dim7":  ledToFrets([-1,9,8,10,8,-1]).map(f => ({ fret: f })),
    "E Aug":   ledToFrets([10,7,8,9,9,10]).map(f => ({ fret: f })),
    "E Sus2":  ledToFrets([10,8,8,7,6,10]).map(f => ({ fret: f })),
    "E Sus4":  ledToFrets([10,8,8,7,10,10]).map(f => ({ fret: f })),
    "E maj7":  ledToFrets([10,8,10,9,10,10]).map(f => ({ fret: f })),
    "E m7":    ledToFrets([10,8,10,10,10,10]).map(f => ({ fret: f })),
    "E 7sus4": ledToFrets([10,8,10,8,10,10]).map(f => ({ fret: f })),
  
    // --------------------------------
    // F GROUP
    // --------------------------------
    "F Major": ledToFrets([9,7,7,8,9,9]).map(f => ({ fret: f })),
    "F Minor": ledToFrets([9,7,7,9,9,9]).map(f => ({ fret: f })),
    "F 7":     ledToFrets([9,7,9,8,9,9]).map(f => ({ fret: f })),
    "F Dim":   ledToFrets([9,8,7,9,-1,-1]).map(f => ({ fret: f })),
    "F Dim7":  ledToFrets([-1,8,7,9,8,-1]).map(f => ({ fret: f })),
    "F Aug":   ledToFrets([-1,-1,7,8,8,9]).map(f => ({ fret: f })),
    "F Sus2":  ledToFrets([-1,-1,7,5,4,7]).map(f => ({ fret: f })),
    "F Sus4":  ledToFrets([9,7,7,7,9,9]).map(f => ({ fret: f })),
    "F maj7":  ledToFrets([-1,-1,7,8,9,10]).map(f => ({ fret: f })),
    "F m7":    ledToFrets([9,7,9,9,9,9]).map(f => ({ fret: f })),
    "F 7sus4": ledToFrets([9,7,9,7,9,9]).map(f => ({ fret: f })),
  
    // --------------------------------
    // G GROUP
    // --------------------------------
    "G Major": ledToFrets([7,8,10,10,10,7]).map(f => ({ fret: f })),
    "G Minor": ledToFrets([7,5,5,7,7,7]).map(f => ({ fret: f })),
    "G 7":     ledToFrets([7,8,10,10,10,9]).map(f => ({ fret: f })),
    "G Dim":   ledToFrets([7,6,5,7,-1,-1]).map(f => ({ fret: f })),
    "G Dim7":  ledToFrets([-1,9,8,10,8,-1]).map(f => ({ fret: f })),
    "G Aug":   ledToFrets([7,8,9,10,10,7]).map(f => ({ fret: f })),
    "G Sus2":  ledToFrets([-1,-1,5,3,2,5]).map(f => ({ fret: f })),
    "G Sus4":  ledToFrets([7,5,5,5,7,7]).map(f => ({ fret: f })),
    "G maj7":  ledToFrets([-1,8,10,10,10,8]).map(f => ({ fret: f })),
    "G m7":    ledToFrets([7,5,7,7,7,7]).map(f => ({ fret: f })),
    "G 7sus4": ledToFrets([7,5,7,5,7,7]).map(f => ({ fret: f })),
  
    // -----------------------------------------------
    // SHARPS/FLATS (Ab/G#, Bb/A#, Db/C#, Eb/D#, Gb/F#)
    // -----------------------------------------------
    "Ab/G# Major": ledToFrets([-1,-1,9,9,9,6]).map(f => ({ fret: f })),
    "Ab/G# Minor": ledToFrets([6,4,4,6,6,6]).map(f => ({ fret: f })),
    "Ab/G# 7":     ledToFrets([-1,-1,9,9,9,8]).map(f => ({ fret: f })),
    "Ab/G# Dim":   ledToFrets([6,5,4,6,-1,-1]).map(f => ({ fret: f })),
    "Ab/G# Dim7":  ledToFrets([-1,8,7,9,8,-1]).map(f => ({ fret: f })),
    "Ab/G# Aug":   ledToFrets([-1,-1,8,9,9,10]).map(f => ({ fret: f })),
    "Ab/G# Sus2":  ledToFrets([-1,-1,4,2,1,4]).map(f => ({ fret: f })),
    "Ab/G# Sus4":  ledToFrets([-1,-1,9,9,8,6]).map(f => ({ fret: f })),
    "Ab/G# maj7":  ledToFrets([-1,7,9,9,9,7]).map(f => ({ fret: f })),
    "Ab/G# m7":    ledToFrets([-1,-1,9,9,10,8]).map(f => ({ fret: f })),
    "Ab/G# 7sus4": ledToFrets([6,4,6,4,6,6]).map(f => ({ fret: f })),
  
    "Bb/A# Major": ledToFrets([-1,9,7,7,7,9]).map(f => ({ fret: f })),
    "Bb/A# Minor": ledToFrets([-1,9,7,7,8,9]).map(f => ({ fret: f })),
    "Bb/A# 7":     ledToFrets([-1,9,7,9,7,9]).map(f => ({ fret: f })),
    "Bb/A# Dim":   ledToFrets([-1,9,8,7,8,-1]).map(f => ({ fret: f })),
    "Bb/A# Dim7":  ledToFrets([-1,9,8,10,8,-1]).map(f => ({ fret: f })),
    "Bb/A# Aug":   ledToFrets([-1,-1,6,7,7,8]).map(f => ({ fret: f })),
    "Bb/A# Sus2":  ledToFrets([-1,9,7,7,9,9]).map(f => ({ fret: f })),
    "Bb/A# Sus4":  ledToFrets([-1,9,7,7,6,9]).map(f => ({ fret: f })),
    "Bb/A# maj7":  ledToFrets([-1,9,7,8,7,9]).map(f => ({ fret: f })),
    "Bb/A# m7":    ledToFrets([-1,9,7,9,8,9]).map(f => ({ fret: f })),
    "Bb/A# 7sus4": ledToFrets([-1,9,7,9,6,9]).map(f => ({ fret: f })),
  
    "Db/C# Major": ledToFrets([-1,6,7,9,8,9]).map(f => ({ fret: f })),
    "Db/C# Minor": ledToFrets([-1,6,3,3,2,2]).map(f => ({ fret: f })),
    "Db/C# 7":     ledToFrets([-1,6,7,3,2,-1]).map(f => ({ fret: f })),
    "Db/C# Dim":   ledToFrets([-1,6,5,4,5,-1]).map(f => ({ fret: f })),
    "Db/C# Dim7":  ledToFrets([-1,9,8,9,8,-1]).map(f => ({ fret: f })),
    "Db/C# Aug":   ledToFrets([-1,-1,7,8,8,9]).map(f => ({ fret: f })),
    "Db/C# Sus2":  ledToFrets([-1,6,4,4,6,6]).map(f => ({ fret: f })),
    "Db/C# Sus4":  ledToFrets([-1,6,6,9,8,-1]).map(f => ({ fret: f })),
    "Db/C# maj7":  ledToFrets([9,6,7,9,9,9]).map(f => ({ fret: f })),
    "Db/C# m7":    ledToFrets([-1,6,8,6,8,-1]).map(f => ({ fret: f })),
    "Db/C# 7sus4": ledToFrets([-1,6,4,6,3,6]).map(f => ({ fret: f })),
  
    "Eb/D# Major": ledToFrets([-1,-1,9,7,6,7]).map(f => ({ fret: f })),
    "Eb/D# Minor": ledToFrets([-1,-1,9,7,6,8]).map(f => ({ fret: f })),
    "Eb/D# 7":     ledToFrets([-1,-1,9,7,8,7]).map(f => ({ fret: f })),
    "Eb/D# Dim":   ledToFrets([-1,4,3,2,3,-1]).map(f => ({ fret: f })),
    "Eb/D# Dim7":  ledToFrets([-1,-1,9,8,9,8]).map(f => ({ fret: f })),
    "Eb/D# Aug":   ledToFrets([-1,-1,5,6,6,7]).map(f => ({ fret: f })),
    "Eb/D# Sus2":  ledToFrets([-1,-1,9,7,6,9]).map(f => ({ fret: f })),
    "Eb/D# Sus4":  ledToFrets([-1,-1,9,7,6,6]).map(f => ({ fret: f })),
    "Eb/D# maj7":  ledToFrets([-1,-1,9,7,7,7]).map(f => ({ fret: f })),
    "Eb/D# m7":    ledToFrets([-1,-1,9,7,8,8]).map(f => ({ fret: f })),
    "Eb/D# 7sus4": ledToFrets([-1,-1,9,7,8,6]).map(f => ({ fret: f })),
  
    "Gb/F# Major": ledToFrets([8,6,6,7,8,8]).map(f => ({ fret: f })),
    "Gb/F# Minor": ledToFrets([8,6,6,8,8,8]).map(f => ({ fret: f })),
    "Gb/F# 7":     ledToFrets([8,6,8,7,8,8]).map(f => ({ fret: f })),
    "Gb/F# Dim":   ledToFrets([8,7,6,8,-1,-1]).map(f => ({ fret: f })),
    "Gb/F# Dim7":  ledToFrets([8,-1,9,8,9,-1]).map(f => ({ fret: f })),
    "Gb/F# Aug":   ledToFrets([-1,-1,6,7,7,8]).map(f => ({ fret: f })),
    "Gb/F# Sus2":  ledToFrets([-1,-1,6,4,3,6]).map(f => ({ fret: f })),
    "Gb/F# Sus4":  ledToFrets([8,6,6,6,8,8]).map(f => ({ fret: f })),
    "Gb/F# maj7":  ledToFrets([-1,-1,6,7,8,9]).map(f => ({ fret: f })),
    "Gb/F# m7":    ledToFrets([8,6,8,8,8,8]).map(f => ({ fret: f })),
    "Gb/F# 7sus4": ledToFrets([8,6,8,6,8,8]).map(f => ({ fret: f })),
  };
  
  // Fingering positions for each chord
  // 0 = no finger, 1 = index, 2 = middle, 3 = ring, 4 = pinky
  export const chordFingers: Record<string, number[]> = {
    // A GROUP
    "A Major": [0, 0, 1, 2, 3, 0],
    "A Minor": [0, 0, 2, 3, 1, 0],
    "A 7": [0, 0, 1, 0, 2, 0],
    "A Dim": [0, 0, 2, 1, 3, 0],
    "A Dim7": [1, 0, 3, 2, 4, 0],
    "A Aug": [0, 0, 1, 2, 3, 4],
    "A Sus2": [0, 0, 1, 2, 4, 0],
    "A Sus4": [0, 0, 1, 2, 4, 0],
    "A maj7": [0, 0, 1, 3, 2, 0],
    "A m7": [0, 0, 1, 3, 2, 0],
    "A 7sus4": [0, 0, 1, 3, 4, 0],
  
    // E GROUP (common beginner chords)
    "E Major": [0, 2, 3, 1, 0, 0],
    "E Minor": [0, 2, 3, 0, 0, 0],
    "E 7": [0, 2, 0, 1, 3, 0],
  
    // D GROUP
    "D Major": [0, 0, 0, 1, 3, 2],
    "D Minor": [0, 0, 0, 1, 3, 2],
    "D 7": [0, 0, 0, 1, 2, 3],
  
    // G GROUP
    "G Major": [3, 1, 0, 0, 0, 2],
    "G Minor": [3, 1, 0, 0, 0, 2],
    "G 7": [3, 1, 0, 0, 0, 2],
  
    // C GROUP
    "C Major": [0, 3, 2, 0, 1, 0],
    "C Minor": [0, 1, 3, 4, 2, 0],
    "C 7": [0, 3, 2, 3, 1, 0],
  
    // Add more fingerings as needed...
  };
  
  export default chordShapes;
  