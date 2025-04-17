// src/components/StaffView.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MusicNote from './MusicNote';

interface NoteEvent {
  id: string;
  startTime: number;  // in seconds
  pitch: string;
}

interface StaffViewProps {
  noteEvents: NoteEvent[];
  currentTime: number;
  zoneStart?: number;
  zoneEnd?: number;
}

// Map note pitches to staff positions (y-coordinates)
// In standard music notation:
// - E4 is on the first line from the bottom
// - G4 is on the second line from the bottom
// - B4 is on the middle line
// - D5 is on the fourth line from the bottom
// - F5 is on the top line
const NOTE_POSITIONS: Record<string, number> = {
  'E4': 135,  // First line from bottom
  'F4': 112,
  'G4': 90,   // Second line from bottom
  'A4': 67,
  'B4': 45,   // Middle line
  'C5': 22,
  'D5': 0,    // Fourth line from bottom
  'E5': -22,
  'F5': -45,  // Top line
};

/**
 * A staff that is 100% wide, ~300+ px tall, has 5 lines spaced by 45 px,
 * and we place notes at x = (startTime - currentTime)*80 + offset.
 */
const StaffView: React.FC<StaffViewProps> = ({
  noteEvents = [],
  currentTime,
  zoneStart = 100,
  zoneEnd = 200,
}) => {

  return (
    <View style={styles.staffContainer}>
      {/* Background for better visibility */}
      <View style={styles.background} />

      {/* 5 staff lines, each 45 px apart */}
      {Array.from({ length: 5 }, (_, i) => (
        <View
          key={`staff-line-${i}`}
          style={[
            styles.staffLine,
            { top: 45 + i * 45 }, // spacing lines downward
          ]}
        />
      ))}

      {/* Playing zone with gradient and borders */}
      <View style={[styles.playZone, { left: zoneStart, width: zoneEnd - zoneStart }]}>
        <View style={styles.playZoneBorderLeft} />
        <View style={styles.playZoneBorderRight} />
      </View>

      {/* Place each note */}
      {noteEvents.map((note) => {
        const timeDiff = note.startTime - currentTime;
        const xPos = timeDiff * 80 + 400;
        const yPos = NOTE_POSITIONS[note.pitch] || 45; // Default to middle line if pitch not found

        // Only render notes that are on screen
        if (xPos < -50 || xPos > 1000) return null;

        return (
          <MusicNote
            key={note.id}
            pitch={note.pitch}
            xPos={xPos}
            yPos={yPos}
            isInPlayZone={xPos >= zoneStart && xPos <= zoneEnd}
          />
        );
      })}
    </View>
  );
};

export default StaffView;

const styles = StyleSheet.create({
  staffContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5', // Slightly darker background for better contrast
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff', // Pure white background
  },
  staffLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#000',
  },
  playZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 128, 255, 0.15)', // Slightly more opaque blue background
  },
  playZoneBorderLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 3,
    backgroundColor: '#0066CC', // Darker blue for better contrast
  },
  playZoneBorderRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 3,
    backgroundColor: '#0066CC', // Darker blue for better contrast
  },
});
