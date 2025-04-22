import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import base64 from 'react-native-base64';
import Slider from '@react-native-community/slider';

import ChordDiagram from '../components/ChordDiagram';
import TimingIndicator from '../components/TimingIndicator';
import { chordShapes } from '../helpers/ChordShapes';
import { BluetoothContext } from '../context/BluetoothContext';

interface SongNote {
  id: string;
  time: number;
  duration: number;
  chord: string;
  startTime: number;
  pitch: string;  // Added to match NoteEvent interface
  finger?: number;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  difficulty: string;
  tempo: number;
  notes: SongNote[];
}

// Define navigation types
type RootStackParamList = {
  Home: undefined;
  Tutorial: undefined;
  DemoSong: undefined;
  LearnSongs: undefined;
  SongPlay: { song: Song };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'SongPlay'>;
type SongPlayRouteProp = RouteProp<RootStackParamList, 'SongPlay'>;

// Animation settings
const NOTE_SPEED = 80; // pixels per second
const ZONE_START = 150; // Moved zone start position right
const ZONE_END = 250; // Extended zone end position
const ZONE_DELAY = 0.5; // seconds to wait after note enters zone before checking

// BLE constants
const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
const CHARACTERISTIC_UUID = "abcd1234-5678-1234-5678-abcdef123456";

// Map "LOW E", "A", etc. to indexes 0..5 for string statuses
const stringIndexMap: Record<string, number> = {
  "LOW E": 0,
  "A": 1,
  "D": 2,
  "G": 3,
  "B": 4,
  "HIGH E": 5,
};

interface NotesListProps {
  notes: SongNote[];
  currentTime: number;
  onNotePress: (note: SongNote) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, currentTime, onNotePress }) => {
  return (
    <View style={styles.notesList}>
      {notes.map((note, index) => {
        const formattedChord = note.chord.replace(/_/g, ' ');
        const timeInSeconds = note.startTime / 1000;
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        
        return (
          <TouchableOpacity
            key={`${note.id}-${index}`}
            style={[
              styles.noteItem,
              currentTime >= note.startTime && 
              currentTime <= note.startTime + note.duration && 
              styles.activeNote
            ]}
            onPress={() => onNotePress(note)}
          >
            <Text style={styles.noteText}>{formattedChord}</Text>
            <Text style={styles.noteTime}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const SongPlayScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SongPlayRouteProp>();
  const { song } = route.params;
  const bluetoothContext = useContext(BluetoothContext);
  const { connected, connectedDevice } = bluetoothContext || {};

  // State management
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNote, setCurrentNote] = useState<SongNote | null>(null);
  const [score, setScore] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [message, setMessage] = useState(`Press Play to start ${song.title}`);
  const [isNoteInZone, setIsNoteInZone] = useState(false);
  const [isNotePlayed, setIsNotePlayed] = useState(false);
  const [stringStatuses, setStringStatuses] = useState<string[]>(Array(6).fill("NO_NOTE"));
  const [currentChord, setCurrentChord] = useState("");
  const [currentFinger, setCurrentFinger] = useState<number | null>(null);
  const [formattedChord, setFormattedChord] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Refs for animation
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  
  // Calculate song duration from notes
  const songDuration = Math.max(...song.notes.map(note => note.startTime + note.duration));

  // Format chord name (convert G_Major to G Major)
  const formatChordName = (chord: string) => {
    return chord.replace(/_/g, ' ');
  };

  // Start the song
  const startSong = () => {
    setIsPlaying(true);
    setCurrentTime(0);
    setScore(0);
    setTotalNotes(0);
    setAccuracy(0);
    setMessage(`Playing: ${song.title}`);
    startAnimation();
  };
  
  // Pause the song
  const pauseSong = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(false);
    setMessage(`${song.title} paused. Press Play to continue.`);
  };

  // Find the current note based on time
  const findCurrentNote = (time: number): SongNote | null => {
    for (const note of song.notes) {
      if (time >= note.startTime && time < (note.startTime + note.duration)) {
        return note;
      }
    }
    return null;
  };
  
  // Start the animation
  const startAnimation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    lastUpdateTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateTimeRef.current);
      lastUpdateTimeRef.current = now;
      
      setCurrentTime(prevTime => {
        const newTime = prevTime + deltaTime;
        
        // Find current note
        const note = findCurrentNote(newTime);
        
        if (note) {
          if (!currentNote || note.id !== currentNote.id) {
            // New note detected
            setCurrentNote(note);
            setCurrentChord(note.chord);
            setFormattedChord(formatChordName(note.chord));
            setCurrentFinger(note.finger || null);
            setIsNotePlayed(false);
            sendChordCommand(note.chord);
            setMessage(`Use finger ${note.finger || 1} for ${formatChordName(note.chord)}`);
          }
          
          // Don't advance time if note hasn't been played correctly
          if (!isNotePlayed) {
            return prevTime;
          }
        } else if (newTime >= songDuration) {
          // Song finished
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setIsPlaying(false);
          setMessage(`Great job! You've completed ${song.title}!\nScore: ${score}/${totalNotes} (${Math.round(accuracy * 100)}% accuracy)`);
        }
        
        return newTime;
      });
    }, 16); // ~60fps
  };
  
  // Send chord command to device
  const sendChordCommand = async (chordName: string) => {
    if (!connectedDevice || !connected) {
      console.log("Not connected to device");
      return;
    }
    
    try {
      // The chord is already in the correct format with underscore
      const command = `SHOW:${chordName}_CHORD`;
      const base64Command = base64.encode(command);
      await connectedDevice.writeCharacteristicWithoutResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Command
      );
      console.log("Sent command:", command);
    } catch (err) {
      console.error("Error sending command:", err);
    }
  };
  
  // Parse BLE message and update string statuses
  const parseBLEMessage = (msg: string) => {
    const [chordPart, statusPart] = msg.split(";");
    if (!chordPart || !statusPart) {
      console.log("Invalid message format");
      return;
    }
    
    const chordLabel = chordPart.replace("CHORD:", "").trim();
    setCurrentChord(chordLabel);

    const stStr = statusPart.replace("STATUS:", "").trim();
    const pairs = stStr.split(",");
    const newStatuses = Array(6).fill("NO_NOTE");
    
    pairs.forEach((p) => {
      const [stringName, st] = p.split(":");
      if (stringName && st) {
        const idx = stringIndexMap[stringName.trim().toUpperCase()];
        if (idx !== undefined) {
          newStatuses[idx] = st.trim().toUpperCase();
        }
      }
    });
    
    setStringStatuses(newStatuses);
    
    // Check if all strings are correct
    const allCorrect = newStatuses.every(status => status === "CORRECT");
    if (allCorrect && !isNotePlayed) {
      setIsNotePlayed(true);
      setScore(prev => prev + 1);
      setTotalNotes(prev => prev + 1);
      setAccuracy((score + 1) / (totalNotes + 1));
      setMessage("Perfect! Keep going!");
    }
  };

  // Handle play/pause
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      startSong();
    }
  };
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // BLE subscription
  useEffect(() => {
    if (!connectedDevice || !connected) return;

    const subscription = connectedDevice.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error) {
          console.error("Notification error:", error);
          return;
        }
        
        if (characteristic && characteristic.value) {
          const raw = base64.decode(characteristic.value);
          console.log("Received message:", raw);
          parseBLEMessage(raw);
        }
      }
    );

    return () => {
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    };
  }, [connectedDevice, connected]);

  const mainContent = (
    <View style={styles.mainContainer}>
      <View style={styles.songInfo}>
        <View style={styles.songDetails}>
          <Text style={styles.songTitle}>{song.title}</Text>
          <Text style={styles.artistText}>by {song.artist}</Text>
        </View>
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => setShowInstructions(true)}
        >
          <Text style={styles.infoButtonText}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.staffContainer}>
          <TimingIndicator
            currentTime={currentTime}
            notes={song.notes}
            width={Dimensions.get('window').width - 40}
            isPlaying={isPlaying}
          />
        </View>

        <View style={styles.chordContainer}>
          <Text style={styles.chordTitle}>
            Current Chord: {currentChord}
          </Text>
          <ChordDiagram 
            chordName={currentChord} 
            stringStatuses={stringStatuses}
            currentFinger={currentFinger}
          />
          {isNotePlayed && (
            <View style={styles.correctIndicator}>
              <Text style={styles.correctText}>CORRECT!</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.promptText}>{message}</Text>
        <Text style={styles.tutorialHint}>Place fingers according to the chord diagram</Text>
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={handlePlayPause}
          >
            <Text style={styles.playButtonText}>
              {isPlaying ? 'Pause' : 'Play'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {mainContent}
    </SafeAreaView>
  );
};

export default SongPlayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
  },
  songInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  songDetails: {
    flex: 1,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  artistText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b5998',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  staffContainer: {
    height: 200,
  },
  chordContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  chordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  bottomSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  promptText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 16,
  },
  tutorialHint: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  playButton: {
    backgroundColor: '#3b5998',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  correctIndicator: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  correctText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  notesList: {
    flex: 1,
    padding: 16,
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  activeNote: {
    backgroundColor: '#e3f2fd',
  },
  noteText: {
    fontSize: 16,
    fontWeight: '500',
  },
  noteTime: {
    fontSize: 14,
    color: '#666',
  },
}); 