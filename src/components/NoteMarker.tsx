// src/components/NoteMarker.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NoteMarkerProps {
  note: {
    pitch: string;
    chordName?: string;
  };
  xPos: number;
}

const NoteMarker: React.FC<NoteMarkerProps> = ({ note, xPos }) => {
  const stylePos = {
    position: 'absolute' as const,
    left: xPos,  // dynamic based on currentTime
    top: 50,     // for demonstration
  };

  return (
    <View style={[styles.noteContainer, stylePos]}>
      <Text style={styles.noteText}>
        {note.chordName ? note.chordName : note.pitch}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noteContainer: {
    padding: 4,
    backgroundColor: 'black',
    borderRadius: 4,
  },
  noteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NoteMarker;
