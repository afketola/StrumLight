// helpers.ts
export function frequencyToNoteName(frequency: number): { noteName: string; targetFrequency: number } {
    // Note names for each semitone
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    // Calculate the MIDI note number from frequency (A4 = 440 Hz is MIDI 69)
    const noteNumber = 12 * Math.log2(frequency / 440) + 69;
    const roundedNote = Math.round(noteNumber);
    const noteName = noteNames[roundedNote % 12];
    const targetFrequency = 440 * Math.pow(2, (roundedNote - 69) / 12);
    return { noteName, targetFrequency };
  }
  
  export function frequencyToCents(frequency: number, targetFrequency: number): number {
    // Calculate the difference in cents between two frequencies
    return 1200 * Math.log2(frequency / targetFrequency);
  }
  