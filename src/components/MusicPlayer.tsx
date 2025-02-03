import React from 'react';
import { View, StyleSheet } from 'react-native';
import MusicStaff from './MusicStaff';
import AnimatedNote from './AnimatedNote';

const MusicPlayer = () => {
  return (
    <View style={styles.container}>
      <MusicStaff />
      <AnimatedNote />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000', // Black background for visibility
  },
});

export default MusicPlayer;
