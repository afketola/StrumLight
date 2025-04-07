// src/components/StaffView.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import NoteMarker from './NoteMarker';

interface StaffViewProps {
  currentTime: number;  // in seconds, from the audio playback
  noteEvents: { startTime: number; duration: number; pitch: string; chordName?: string; }[];
}

const StaffView: React.FC<StaffViewProps> = ({ currentTime, noteEvents }) => {
  // Filter or map noteEvents to the staff.
  // Possibly compute how far “left/right” each note should be based on (startTime - currentTime).
  return (
    <View style={styles.staffContainer}>
      {/* Draw staff lines or background */}
      {/* Render each note as a <NoteMarker /> */}
      {noteEvents.map((note, idx) => {
        // Compute position
        const timeDiff = note.startTime - currentTime;
        // e.g., x-position in px
        const xPos = timeDiff * 100; // scale factor for speed
        return (
          <NoteMarker
            key={idx}
            note={note}
            xPos={xPos}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  staffContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
});

export default StaffView;
