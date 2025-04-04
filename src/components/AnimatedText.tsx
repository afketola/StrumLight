import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import MusicNote from './MusicNote';

interface NoteData {
  id: number;
  pitch: string;
  yOffset: number;
  duration: number;
}

interface Props {
  note: NoteData;
  isPlaying: boolean;
}

/**
 * AnimatedNote
 * - Animates horizontally across the screen.
 * - Renders an actual note shape from MusicNote.tsx
 */
const AnimatedNote: React.FC<Props> = ({ note, isPlaying }) => {
  const translateX = useRef(new Animated.Value(600)).current; // Start off-screen to right

  useEffect(() => {
    if (isPlaying) {
      // Animate from ~600 px to -100 px
      Animated.timing(translateX, {
        toValue: -100,
        duration: note.duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    } else {
      // If paused, you could stop or hold the animation
      // But built-in Animated doesn't provide an easy 'pause'
      // For a real pause/resume, consider react-native-reanimated
    }
  }, [isPlaying]);

  const noteTop = 50 + note.yOffset; // 50 is a rough "middle" staff line offset

  return (
    <Animated.View
      style={[
        styles.noteContainer,
        {
          transform: [{ translateX }],
          top: noteTop,
        },
      ]}
    >
      <MusicNote pitch={note.pitch} />
    </Animated.View>
  );
};

export default AnimatedNote;

const styles = StyleSheet.create({
  noteContainer: {
    position: 'absolute',
  },
});
