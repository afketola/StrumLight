import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface Note {
  id: string;
  startTime: number;
  duration: number;
  chord: string;
}

interface TimingIndicatorProps {
  currentTime: number;
  notes: Note[];
  width: number;
  isPlaying: boolean;
}

const TimingIndicator: React.FC<TimingIndicatorProps> = ({
  currentTime,
  notes,
  width,
  isPlaying,
}) => {
  const ballAnim = useRef(new Animated.Value(width)).current;
  
  // Find current and next note
  const currentNote = notes.find(note => 
    currentTime >= note.startTime && currentTime < note.startTime + note.duration
  );
  
  const nextNote = notes.find(note => 
    note.startTime > currentTime
  );

  // Start animation when a new note begins
  useEffect(() => {
    if (currentNote && isPlaying) {
      ballAnim.setValue(width);
      
      Animated.timing(ballAnim, {
        toValue: 0,
        duration: currentNote.duration * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  }, [currentNote, isPlaying]);

  // Calculate play zone position (centered, 30% width)
  const playZoneStart = width * 0.35;
  const playZoneWidth = width * 0.3;

  return (
    <View style={[styles.container, { width }]}>
      {/* Current chord display */}
      <View style={styles.currentChordDisplay}>
        <Text style={styles.currentChordLabel}>Current</Text>
        <Text style={styles.currentChordText}>
          {currentNote ? currentNote.chord.replace(/_/g, ' ') : '-'}
        </Text>
      </View>

      {/* Timing track */}
      <View style={styles.timingTrackContainer}>
        {/* Play zone */}
        <View style={[
          styles.playZone,
          {
            left: playZoneStart,
            width: playZoneWidth,
          }
        ]} />
        
        {/* Main track */}
        <View style={styles.timingTrack} />
        
        {/* Animated ball */}
        <Animated.View 
          style={[
            styles.timingBall,
            {
              transform: [
                { translateX: ballAnim },
              ],
            },
          ]}
        />
      </View>

      {/* Next chord preview */}
      {nextNote && (
        <View style={styles.nextChordPreview}>
          <Text style={styles.nextChordLabel}>Next:</Text>
          <Text style={styles.nextChordText}>
            {nextNote.chord.replace(/_/g, ' ')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  timingTrackContainer: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timingTrack: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  playZone: {
    position: 'absolute',
    height: '100%',
    backgroundColor: 'rgba(59, 89, 152, 0.15)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3b5998',
    borderStyle: 'dashed',
    zIndex: 1,
  },
  timingBall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3b5998',
    position: 'absolute',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 2,
  },
  currentChordDisplay: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  currentChordLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  currentChordText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  nextChordPreview: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 8,
    opacity: 0.7,
  },
  nextChordLabel: {
    fontSize: 12,
    color: '#888',
    marginRight: 8,
  },
  nextChordText: {
    fontSize: 14,
    color: '#666',
  },
});

export default TimingIndicator; 