import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import MusicStaff from './MusicStaff';
import TutorialText from './TutorialText';
import GradientButton from './GradientButton';

interface NoteData {
  id: number;
  pitch: string;
  x: number;
  y: number;
  color?: string;
}

interface SongData {
  title: string;
  notes: NoteData[];
}

interface MusicPlayerProps {
  data: SongData;
}

/**
 * MusicPlayer
 * - High-level container that orchestrates the staff, notes, text, and controls.
 * - Could handle "start", "pause", "stop" logic or feed real-time note feedback.
 */
const MusicPlayer: React.FC<MusicPlayerProps> = ({ data }) => {
  const [notes, setNotes] = useState(data.notes);

  const handleStart = () => {
    // Example: maybe animate notes or begin receiving feedback
    console.log('Starting tutorial...');
  };

  const handleStop = () => {
    // Example: stop the song or finalize results
    console.log('Stopping tutorial...');
  };

  return (
    <View style={styles.container}>
      <TutorialText text={`Now playing: ${data.title}`} />
      <ScrollView horizontal style={styles.scrollContainer}>
        <MusicStaff notes={notes} />
      </ScrollView>

      <View style={styles.controls}>
        <GradientButton title="Start" onPress={handleStart} />
        <GradientButton
          title="Stop"
          onPress={handleStop}
          colors={['#e53935', '#f44336']}
          style={{ marginLeft: 10 }}
        />
      </View>
    </View>
  );
};

export default MusicPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
    alignItems: 'center',
  },
  scrollContainer: {
    marginVertical: 10,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 20,
  },
});
