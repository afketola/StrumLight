import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import MusicPlayer from '../components/MusicPlayer';
import TutorialText from '../components/TutorialText';

const TutorialScreen = () => {
  useEffect(() => {
    Orientation.lockToLandscape(); // Force landscape mode
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <TutorialText text="🎵 Play Along with the Notes 🎵" />
      <MusicPlayer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background for contrast
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TutorialScreen;
