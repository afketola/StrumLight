// MusicStaff.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import AnimatedNote from './AnimatedNote';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface NoteData {
  id: number;
  pitch: string;
  yOffset: number;
  duration: number;
}

interface MusicStaffProps {
  notes: NoteData[];
  isPlaying: boolean;
}

const MusicStaff: React.FC<MusicStaffProps> = ({ notes, isPlaying }) => {
  const numberOfLines = 5;
  const lineSpacing = SCREEN_HEIGHT / (numberOfLines + 1);

  // Manage the play zone color (default: translucent white)
  const [zoneColor, setZoneColor] = useState('rgba(255,255,255,0.2)');

  const handleNoteInZone = (id: number) => {
    setZoneColor('yellow');
  };

  const handleNoteCorrect = (id: number) => {
    setZoneColor('green');
    setTimeout(() => setZoneColor('rgba(255,255,255,0.2)'), 500);
  };

  const handleNoteMissed = (id: number) => {
    setZoneColor('red');
    setTimeout(() => setZoneColor('rgba(255,255,255,0.2)'), 500);
  };

  return (
    <View style={{ flex: 1 }}>
      <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH} style={StyleSheet.absoluteFill}>
        {Array.from({ length: numberOfLines }).map((_, i) => (
          <Line
            key={i}
            x1="0"
            y1={(i + 1) * lineSpacing}
            x2={SCREEN_WIDTH.toString()}
            y2={(i + 1) * lineSpacing}
            stroke="#CCC"
            strokeWidth="2"
          />
        ))}
      </Svg>
      {/* Play Zone Overlay */}
      <View style={[styles.playZone, { backgroundColor: zoneColor }]} />
      {/* Render Animated Notes */}
      {notes.map((note) => (
        <AnimatedNote
          key={note.id}
          note={note}
          isPlaying={isPlaying}
          onNoteInZone={handleNoteInZone}
          onNoteCorrect={handleNoteCorrect}
          onNoteMissed={handleNoteMissed}
        />
      ))}
    </View>
  );
};

export default MusicStaff;

const styles = StyleSheet.create({
  playZone: {
    position: 'absolute',
    left: 100, // Position of the play zone
    width: 40,
    top: 0,
    bottom: 0,
    zIndex: 10,
  },
});
