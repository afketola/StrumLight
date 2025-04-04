// AnimatedNote.tsx
import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions, StyleSheet, Text } from 'react-native';
import MusicNote from './MusicNote';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NoteData {
  id: number;
  pitch: string;
  yOffset: number;
  duration: number;
}

interface AnimatedNoteProps {
  note: NoteData;
  isPlaying: boolean;
  onNoteInZone: (id: number) => void;
  onNoteCorrect: (id: number) => void;
  onNoteMissed: (id: number) => void;
}

const AnimatedNote: React.FC<AnimatedNoteProps> = ({
  note,
  isPlaying,
  onNoteInZone,
  onNoteCorrect,
  onNoteMissed,
}) => {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const zoneLeft = 100;
  const zoneRight = 140;
  const hasTriggeredZone = useRef(false);

  useEffect(() => {
    if (isPlaying) {
      const listenerId = translateX.addListener(({ value }) => {
        if (!hasTriggeredZone.current && value >= zoneLeft && value <= zoneRight) {
          hasTriggeredZone.current = true;
          onNoteInZone(note.id);
          // For demo purposes, assume correct
          onNoteCorrect(note.id);
        }
      });

      Animated.timing(translateX, {
        toValue: -100,
        duration: note.duration,
        useNativeDriver: true,
      }).start(() => {
        if (!hasTriggeredZone.current) {
          onNoteMissed(note.id);
        }
      });

      return () => {
        translateX.removeListener(listenerId);
      };
    }
  }, [isPlaying]);

  // Calculate vertical position (base offset plus note.yOffset). Adjust base as needed.
  const noteTop = 200 + note.yOffset;

  return (
    <Animated.View
      style={[
        styles.noteContainer,
        { transform: [{ translateX }], top: noteTop },
      ]}
    >
      <MusicNote pitch={note.pitch} />
      <Text style={styles.noteLabel}>{note.pitch}</Text>
    </Animated.View>
  );
};

export default AnimatedNote;

const styles = StyleSheet.create({
  noteContainer: {
    position: 'absolute',
    left: 0,
    width: 50,
    height: 60,
    alignItems: 'center',
  },
  noteLabel: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
});
