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
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import base64 from 'react-native-base64';

import StaffView from '../components/StaffView';
import ChordDiagram from '../components/ChordDiagram';
import { chordShapes } from '../helpers/ChordShapes';
import { BluetoothContext } from '../context/BluetoothContext';

// Define navigation types
type RootStackParamList = {
  Home: undefined;
  Tutorial: undefined;
  DemoSong: undefined;
  LearnSongs: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'DemoSong'>;

interface NoteEvent {
  id: string;
  startTime: number;
  pitch: string;
  chord: string;
  duration?: number;
  finger?: number; // Added finger property for fingering indication
}

// Demo song data (Enter Sandman intro)
const DEMO_SONG = {
  title: "Enter Sandman",
  artist: "Metallica",
  difficulty: "Beginner",
  tempo: 120, // BPM
  notes: [
    // Main riff
    { id: '1', startTime: 2, pitch: 'E4', chord: 'E Minor', duration: 1, finger: 1 },
    { id: '2', startTime: 4, pitch: 'G4', chord: 'E Minor', duration: 1, finger: 3 },
    { id: '3', startTime: 6, pitch: 'E4', chord: 'E Minor', duration: 1, finger: 1 },
    { id: '4', startTime: 8, pitch: 'B4', chord: 'E Minor', duration: 1, finger: 4 },
    { id: '5', startTime: 10, pitch: 'D5', chord: 'E Minor', duration: 1, finger: 2 },
    { id: '6', startTime: 12, pitch: 'E4', chord: 'E Minor', duration: 1, finger: 1 },
    // Repeat with slight variation
    { id: '7', startTime: 14, pitch: 'E4', chord: 'E Minor', duration: 1, finger: 1 },
    { id: '8', startTime: 16, pitch: 'G4', chord: 'E Minor', duration: 1, finger: 3 },
    { id: '9', startTime: 18, pitch: 'E4', chord: 'E Minor', duration: 1, finger: 1 },
    { id: '10', startTime: 20, pitch: 'B4', chord: 'E Minor', duration: 1, finger: 4 },
    { id: '11', startTime: 22, pitch: 'D5', chord: 'E Minor', duration: 1, finger: 2 },
    { id: '12', startTime: 24, pitch: 'E4', chord: 'E Minor', duration: 1, finger: 1 }
  ]
};

// Tutorial song data (simplified for learning)
const TUTORIAL_SONG = {
  title: "Enter Sandman",
  artist: "Metallica",
  difficulty: "Beginner",
  tempo: 60, // Slower tempo for learning
  notes: [
    { id: 't1', startTime: 2, pitch: 'E4', chord: 'E Minor', duration: 2, finger: 1 },
    { id: 't2', startTime: 6, pitch: 'G4', chord: 'E Minor', duration: 2, finger: 3 },
    { id: 't3', startTime: 10, pitch: 'E4', chord: 'E Minor', duration: 2, finger: 1 },
    { id: 't4', startTime: 14, pitch: 'B4', chord: 'E Minor', duration: 2, finger: 4 },
    { id: 't5', startTime: 18, pitch: 'D5', chord: 'E Minor', duration: 2, finger: 2 }
  ]
};

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

const DemoSongScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const bluetoothContext = useContext(BluetoothContext);
  const { connected, connectedDevice } = bluetoothContext || {};

  // State management
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNote, setCurrentNote] = useState<NoteEvent | null>(null);
  const [score, setScore] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [message, setMessage] = useState('Press Play to start the demo');
  const [isNoteInZone, setIsNoteInZone] = useState(false);
  const [isNotePlayed, setIsNotePlayed] = useState(false);
  const [stringStatuses, setStringStatuses] = useState<string[]>(Array(6).fill("NO_NOTE"));
  const [currentChord, setCurrentChord] = useState("E Minor");
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentFinger, setCurrentFinger] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Refs for animation
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const animationRef = useRef<Animated.Value>(new Animated.Value(0));
  
  // Tutorial state
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorialComplete, setShowTutorialComplete] = useState(false);
  const [allStringsCorrect, setAllStringsCorrect] = useState(false);
  const [noteResult, setNoteResult] = useState<'correct' | 'incorrect' | null>(null);
  const [tutorialTimer, setTutorialTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Start the demo
  const startDemo = () => {
    setIsPlaying(true);
    setCurrentTime(0);
    setScore(0);
    setTotalNotes(0);
    setAccuracy(0);
    setTutorialStep(0);
    setShowTutorialComplete(false);
    setAllStringsCorrect(false);
    setNoteResult(null);
    setMessage('Playing: ' + DEMO_SONG.title);
    setShowTutorial(false);
    startAnimation();
  };
  
  // Start the tutorial
  const startTutorial = () => {
    setIsPlaying(true);
    setCurrentTime(0);
    setScore(0);
    setTotalNotes(0);
    setAccuracy(0);
    setTutorialStep(0);
    setShowTutorialComplete(false);
    setAllStringsCorrect(false);
    setNoteResult(null);
    setMessage('Tutorial: ' + TUTORIAL_SONG.title);
    setShowTutorial(true);
    startTutorialAnimation();
  };
  
  // Start the tutorial animation
  const startTutorialAnimation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (tutorialTimer) {
      clearTimeout(tutorialTimer);
    }
    
    lastUpdateTimeRef.current = Date.now();
    
    // Start with the first note
    const firstNote = TUTORIAL_SONG.notes[0];
    setCurrentNote(firstNote);
    setCurrentChord(firstNote.chord);
    setCurrentFinger(firstNote.finger || null);
    setMessage(`Current chord: ${firstNote.chord}`);
    sendChordCommand(firstNote.chord);
    
    // Set a timer for each note
    const noteDuration = 5000; // 5 seconds per note
    
    const startNoteTimer = (step: number) => {
      if (step >= TUTORIAL_SONG.notes.length) {
        setShowTutorialComplete(true);
        setIsPlaying(false);
        setMessage("Tutorial completed! Great job!");
        return;
      }
      
      const note = TUTORIAL_SONG.notes[step];
      setCurrentNote(note);
      setCurrentChord(note.chord);
      setCurrentFinger(note.finger || null);
      setMessage(`Current chord: ${note.chord}`);
      setNoteResult(null);
      sendChordCommand(note.chord);
      
      // Set a timer to move to the next note
      const timer = setTimeout(() => {
        // If the note wasn't played correctly, mark it as incorrect
        if (!isNotePlayed) {
          setNoteResult('incorrect');
          setMessage(`Incorrect. Moving to next note...`);
          
          // Wait a moment before moving to the next note
          setTimeout(() => {
            setTutorialStep(prev => prev + 1);
            startNoteTimer(step + 1);
          }, 1500);
        } else {
          // If the note was played correctly, move to the next note
          setTutorialStep(prev => prev + 1);
          startNoteTimer(step + 1);
        }
      }, noteDuration);
      
      setTutorialTimer(timer);
    };
    
    // Start with the first note
    startNoteTimer(0);
    
    // Animation timer for visual effects
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateTimeRef.current) / 1000;
      lastUpdateTimeRef.current = now;
      
      setCurrentTime(prevTime => {
        const newTime = prevTime + deltaTime;
        return newTime;
      });
    }, 16);
  };
  
  // Pause the demo
  const pauseDemo = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(false);
    setMessage('Demo paused. Press Play to continue.');
  };
  
  // Start the animation
  const startAnimation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    lastUpdateTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateTimeRef.current) / 1000;
      lastUpdateTimeRef.current = now;
      
      setCurrentTime(prevTime => {
        const newTime = prevTime + deltaTime;
        
        // Check if any note is in the playing zone
        const noteInZone = DEMO_SONG.notes.some(note => {
          const xPos = (note.startTime - newTime) * NOTE_SPEED + 400;
          return xPos >= ZONE_START && xPos <= ZONE_END;
        });
        
        if (noteInZone && !isNoteInZone) {
          setIsNoteInZone(true);
          setIsNotePlayed(false);
          
          // Find the current note
          const currentNoteObj = DEMO_SONG.notes.find(note => {
            const xPos = (note.startTime - newTime) * NOTE_SPEED + 400;
            return xPos >= ZONE_START && xPos <= ZONE_END;
          });
          
          if (currentNoteObj) {
            setCurrentNote(currentNoteObj);
            setCurrentChord(currentNoteObj.chord);
            setCurrentFinger(currentNoteObj.finger || null);
            setMessage(`Use finger ${currentNoteObj.finger} on the highlighted fret`);
            
            // Send command to device
            sendChordCommand(currentNoteObj.chord);
          }
          
          return prevTime;
        }
        
        if (isNoteInZone && !isNotePlayed && (newTime - lastUpdateTimeRef.current) >= ZONE_DELAY) {
          checkNotePlayed();
        }
        
        const lastNote = DEMO_SONG.notes[DEMO_SONG.notes.length - 1];
        if (newTime > lastNote.startTime + (lastNote.duration || 2) + 2) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setIsPlaying(false);
          setMessage(`Great job! You've completed the intro to ${DEMO_SONG.title}!\nScore: ${score}/${totalNotes} (${Math.round(accuracy * 100)}% accuracy)`);
          return newTime;
        }
        
        return newTime;
      });
    }, 16);
  };
  
  // Send chord command to device
  const sendChordCommand = async (chordName: string) => {
    if (!connectedDevice || !connected) {
      console.log("Not connected to device");
      return;
    }
    
    try {
      // Format: "SHOW:E_Minor_CHORD"
      const [root, type] = chordName.split(" ");
      const shortType = type.replace(/\s+/g, "");
      const command = `SHOW:${root}_${shortType}_CHORD`;
      
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
  
  // Parse BLE message from device
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
    setAllStringsCorrect(allCorrect);
    
    if (allCorrect && !isNotePlayed) {
      setIsNotePlayed(true);
      setScore(prev => prev + 1);
      
      if (showTutorial) {
        // In tutorial mode, mark as correct
        setNoteResult('correct');
        setMessage("Correct! Moving to next note...");
        
        // Clear the timer since we got it right
        if (tutorialTimer) {
          clearTimeout(tutorialTimer);
        }
        
        // Wait a moment before moving to the next note
        setTimeout(() => {
          setTutorialStep(prev => prev + 1);
          
          // Start the next note timer
          const nextStep = tutorialStep + 1;
          if (nextStep < TUTORIAL_SONG.notes.length) {
            const note = TUTORIAL_SONG.notes[nextStep];
            setCurrentNote(note);
            setCurrentChord(note.chord);
            setMessage(`Current chord: ${note.chord}`);
            setNoteResult(null);
            sendChordCommand(note.chord);
            
            // Set a timer for the next note
            const timer = setTimeout(() => {
              setTutorialStep(prev => prev + 1);
              if (nextStep + 1 < TUTORIAL_SONG.notes.length) {
                const nextNote = TUTORIAL_SONG.notes[nextStep + 1];
                setCurrentNote(nextNote);
                setCurrentChord(nextNote.chord);
                setMessage(`Current chord: ${nextNote.chord}`);
                setNoteResult(null);
                sendChordCommand(nextNote.chord);
              } else {
                setShowTutorialComplete(true);
                setIsPlaying(false);
                setMessage("Tutorial completed! Great job!");
              }
            }, 5000);
            
            setTutorialTimer(timer);
          } else {
            setShowTutorialComplete(true);
            setIsPlaying(false);
            setMessage("Tutorial completed! Great job!");
          }
        }, 1500);
      } else {
        setIsNoteInZone(false);
        setMessage("Perfect! Keep going!");
      }
    }
  };
  
  // Check if the note was played correctly
  const checkNotePlayed = () => {
    // This function is now primarily handled by the BLE message parsing
    // We'll keep it for simulation purposes when not connected to a device
    if (!connected || !connectedDevice) {
      const shape = chordShapes[currentChord];
      if (!shape) {
        const simulatedStringData = Array(6).fill("INCORRECT");
        setStringStatuses(simulatedStringData);
        return;
      }
      
      // Simulate string data based on the chord shape and current finger position
      const simulatedStringData = shape.map((stringInfo, index) => {
        if (stringInfo.fret > 0) {
          // This string should be played with the correct finger
          const correctFinger = currentNote?.finger || null;
          const randomSuccess = Math.random() > 0.3;
          if (randomSuccess) {
            return "CORRECT";
          } else {
            return Math.random() > 0.5 ? "HIGHER" : "LOWER";
          }
        } else if (stringInfo.fret === 0) {
          return Math.random() > 0.3 ? "CORRECT" : "INCORRECT";
        } else {
          return "NO_NOTE";
        }
      });
      
      setStringStatuses(simulatedStringData);
      
      const isCorrect = isChordCorrect(currentChord, simulatedStringData);
      
      if (isCorrect) {
        setIsNotePlayed(true);
        setIsNoteInZone(false);
        setScore(prev => prev + 1);
        setMessage("Perfect! Keep going!");
        setCurrentTime(prevTime => prevTime + 0.1);
      } else {
        const finger = currentNote?.finger || '';
        setMessage(`Try again! Use finger ${finger} for this note`);
      }
      
      setTotalNotes(prev => prev + 1);
      setAccuracy(score / (totalNotes + 1));
    }
  };
  
  // Handle play/pause
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseDemo();
    } else {
      if (showTutorial) {
        startTutorial();
      } else {
        startDemo();
      }
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
        
        // Check if characteristic and its value exist before decoding
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
  
  // Check if chord is correct
  const isChordCorrect = (chordName: string, statuses: string[]): boolean => {
    const shape = chordShapes[chordName];
    if (!shape) return false;
    
    for (let i = 0; i < shape.length; i++) {
      const stringInfo = shape[i];
      const status = statuses[i];
      
      if (stringInfo.fret > 0 && status !== "CORRECT") return false;
      if (stringInfo.fret === 0 && status !== "CORRECT" && status !== "NO_NOTE") return false;
    }
    return true;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.songInfo}>
        <View style={styles.songDetails}>
          <Text style={styles.songTitle}>{showTutorial ? TUTORIAL_SONG.title : DEMO_SONG.title}</Text>
          <Text style={styles.artistText}>by {showTutorial ? TUTORIAL_SONG.artist : DEMO_SONG.artist}</Text>
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
          <StaffView
            noteEvents={showTutorial ? TUTORIAL_SONG.notes : DEMO_SONG.notes}
            currentTime={currentTime}
            zoneStart={ZONE_START}
            zoneEnd={ZONE_END}
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
          {allStringsCorrect && (
            <View style={styles.correctIndicator}>
              <Text style={styles.correctText}>CORRECT!</Text>
            </View>
          )}
          {noteResult === 'correct' && (
            <View style={[styles.correctIndicator, { backgroundColor: '#00cc00' }]}>
              <Text style={styles.correctText}>CORRECT!</Text>
            </View>
          )}
          {noteResult === 'incorrect' && (
            <View style={[styles.correctIndicator, { backgroundColor: '#cc0000' }]}>
              <Text style={styles.correctText}>INCORRECT</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.promptText}>{message}</Text>
        {showTutorial && (
          <Text style={styles.tutorialHint}>Place fingers according to the chord diagram</Text>
        )}
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={handlePlayPause}
          >
            <Text style={styles.playButtonText}>
              {isPlaying ? 'Pause' : (showTutorial ? 'Start Tutorial' : 'Start Demo')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showInstructions && (
        <View style={styles.instructionsOverlay}>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>How to Play</Text>
            <View style={styles.instructionStep}>
              <Text style={styles.instructionNumber}>1</Text>
              <Text style={styles.instructionText}>Watch the notes move toward the blue zone</Text>
            </View>
            <View style={styles.instructionStep}>
              <Text style={styles.instructionNumber}>2</Text>
              <Text style={styles.instructionText}>When a note stops, check the chord diagram</Text>
            </View>
            <View style={styles.instructionStep}>
              <Text style={styles.instructionNumber}>3</Text>
              <Text style={styles.instructionText}>Place your fingers according to the diagram</Text>
            </View>
            <View style={styles.instructionStep}>
              <Text style={styles.instructionNumber}>4</Text>
              <Text style={styles.instructionText}>Get instant feedback on your playing</Text>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowInstructions(false)}
            >
              <Text style={styles.closeButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showTutorialComplete && (
        <View style={styles.instructionsOverlay}>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>Great Job!</Text>
            <Text style={styles.completionText}>
              You've completed the tutorial! You're ready to try the full demo.
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                setShowTutorialComplete(false);
                setShowTutorial(false);
              }}
            >
              <Text style={styles.closeButtonText}>Start Demo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  instructionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  instructionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b5998',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  closeButton: {
    backgroundColor: '#3b5998',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  correctIndicator: {
    backgroundColor: '#00cc00',
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
  tutorialHint: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  completionText: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 22,
  },
});

export default DemoSongScreen;
