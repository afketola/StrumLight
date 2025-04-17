// src/components/MusicNote.tsx
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface MusicNoteProps {
  pitch: string;
  xPos: number;  
  yPos: number;
  isInPlayZone?: boolean;
}

const MusicNote: React.FC<MusicNoteProps> = ({ pitch, xPos, yPos, isInPlayZone = false }) => {
  return (
    <View style={[
      styles.container, 
      { left: xPos - 25, top: yPos - 25 }, // Offset by half the note size for better centering
      isInPlayZone && styles.inPlayZone
    ]}>
      {/* Glow effect when in play zone */}
      {isInPlayZone && (
        <View style={styles.glow} />
      )}
      
      <Svg width={50} height={50} viewBox="0 0 290.281 290.281">
        <Path
          d="M205.367,0h-30v173.646c-6.239-2.566-13.111-3.922-20.305-3.922
             c-17.458,0-35.266,7.796-48.857,21.388c-25.344,25.343-28.516,63.407-7.072,84.853
             c9.232,9.232,22.016,14.316,35.995,14.316c17.458,0,35.266-7.796,48.857-21.388
             c11.843-11.843,19.308-26.842,21.018-42.234c0.244-2.198,0.355-4.38,0.355-6.537h0.01V0z"
          fill={isInPlayZone ? "#FFD700" : "#000000"}
        />
      </Svg>
    </View>
  );
};

export default MusicNote;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 0.9 }],
  },
  inPlayZone: {
    transform: [{ scale: 1.2 }],
    zIndex: 10,
  },
  glow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    transform: [{ scale: 1.2 }],
  },
});
