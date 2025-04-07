import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated, // We'll use the Animated API from React Native
  ScrollView
} from 'react-native';
import MusicNote from '../components/MusicNote';

// Example notes for the tutorial (pitch + time).
// We'll move them from right to left using Animated.
const tutorialNotes = [
  { id: 'n1', pitch: 'E3', startTime: 0 },
  { id: 'n2', pitch: 'G3', startTime: 2 },
  { id: 'n3', pitch: 'A3', startTime: 4 },
  { id: 'n4', pitch: 'G3', startTime: 6 },
];

// Some simple staff lines. You might have a custom Staff background image instead.
const StaffLines: React.FC = () => {
  return (
    <View style={styles.staffContainer}>
      {[...Array(5)].map((_, i) => (
        <View key={i} style={[styles.staffLine, { top: i * 20 }]} />
      ))}
    </View>
  );
};

const DemoSongScreen = ({ navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // We'll animate notes from right to left.
  // We can create one Animated.Value per note, or a single "scroll" of time.
  const timeRef = useRef(new Animated.Value(0)).current;

  // On mount, we can optionally force a style that looks good in landscape, 
  // or just let it be responsive.
  // For a real approach, consider 'react-native-orientation-locker' or similar
  // to lock orientation if desired.

  useEffect(() => {
    let intervalId: NodeJS.Timer | null = null;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      // Also animate timeRef from 0 to 100 as an example
      // (If your tutorial is 30 seconds, you might go 0 -> 30.)
      Animated.timing(timeRef, {
        toValue: 30, // max time?
        duration: 30000, // 30s
        useNativeDriver: false,
      }).start();
    } else {
      // Pause
      Animated.pause && Animated.pause(); // There's no direct .pause in standard Animated
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      // cleanup animations if needed
    };
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleExit = () => {
    navigation.pop();
  };

  // We'll map each note to an Animated.View that slides left.
  // Time-based approach: If tutorial is 30s, at time=0 note starts at right edge,
  // at time=note.startTime => note enters screen, slides across, etc.
  // A simpler approach: we can just offset them by (timeRef - note.startTime).
  // We'll do a simplistic version here.

  const screenWidth = Dimensions.get('window').width;
  // The staff is let's say 200px wide, we want notes to come from off-screen right to off-screen left.
  // We'll create a function that calculates the x position based on timeRef.
  const getNoteTranslateX = (startTime: number) => {
    // If timeRef < startTime, we want note off-screen to the right.
    // If timeRef > startTime, note should move left proportionally.
    // We'll do (timeRef - startTime) * some velocity
    // e.g. velocity = 40 px/s
    return timeRef.interpolate({
      inputRange: [startTime, startTime + 5], // move across in 5s
      outputRange: [screenWidth, -100], // from right of screen to left
      extrapolate: 'clamp',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutorial: Enter Sandman Demo</Text>
      <Text style={styles.subtitle}>
        Rotate your device for a better view, or use portrait as you like.
      </Text>

      {/* The staff area */}
      <View style={styles.staffArea}>
        <StaffLines />
        {/* We'll absolutely position notes over the staff */}
        {tutorialNotes.map((note) => {
          return (
            <Animated.View
              key={note.id}
              style={[
                styles.noteContainer,
                {
                  transform: [
                    { translateX: getNoteTranslateX(note.startTime) },
                  ],
                  top: 30, // position note in the middle staff line or so
                },
              ]}
            >
              <MusicNote pitch={note.pitch} />
            </Animated.View>
          );
        })}
      </View>

      {/* Control buttons */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.btn} onPress={handlePlay}>
          <Text style={styles.btnText}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handlePause}>
          <Text style={styles.btnText}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleExit}>
          <Text style={styles.btnText}>Exit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DemoSongScreen;

/* -----------------------------------------
            STYLES
----------------------------------------- */


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  staffArea: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  staffContainer: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  staffLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: '#333',
  },
  noteContainer: {
    position: 'absolute',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  btn: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
