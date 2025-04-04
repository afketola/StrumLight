import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import MusicStaff from '../components/MusicStaff';

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Sample data for "Enter Sandman (Intro)" notes.
 * Each note has:
 * - id (unique)
 * - pitch (for display)
 * - yOffset (vertical offset on the staff)
 * - duration (ms to cross from right to left)
 */
const sampleNotes = [
  { id: 1, pitch: 'E4', yOffset: 0,   duration: 6000 },
  { id: 2, pitch: 'G4', yOffset: -20, duration: 6000 },
  { id: 3, pitch: 'F#4', yOffset: -10, duration: 6000 },
  { id: 4, pitch: 'E4', yOffset: 0,   duration: 6000 },
];

const TutorialScreen = () => {
  const [showStartModal, setShowStartModal] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quitConfirm, setQuitConfirm] = useState(false);

  useEffect(() => {
    // Lock to landscape mode on mount
    Orientation.lockToLandscape();
    return () => {
      // Reset to portrait (or default) when leaving
      Orientation.lockToPortrait();
    };
  }, []);

  const handleStart = () => {
    setShowStartModal(false);
    setIsPlaying(true);
  };

  const handlePause = () => {
    // In a real app, you'd pause animations or timers
    setIsPlaying(false);
  };

  const handleQuit = () => {
    setQuitConfirm(true);
  };

  const confirmQuit = () => {
    setQuitConfirm(false);
    // In a real app, navigate away or reset state
  };

  const cancelQuit = () => {
    setQuitConfirm(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* START MODAL */}
      <Modal visible={showStartModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Sandman (Intro)</Text>
            <Text style={styles.modalText}>
              A classic Metallica riff. Press "Start" when ready!
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QUIT CONFIRMATION MODAL */}
      <Modal visible={quitConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quit Tutorial?</Text>
            <Text style={styles.modalText}>Are you sure you want to quit?</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.startButton, { marginRight: 10, backgroundColor: '#AAA' }]}
                onPress={cancelQuit}
              >
                <Text style={styles.startButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.startButton, { backgroundColor: '#E53935' }]}
                onPress={confirmQuit}
              >
                <Text style={styles.startButtonText}>Quit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Text style={styles.songTitle}>Now playing: Enter Sandman</Text>
        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.topBarButton} onPress={handlePause}>
            <Text style={styles.topBarButtonText}>Pause</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.topBarButton, { marginLeft: 10 }]}
            onPress={handleQuit}
          >
            <Text style={styles.topBarButtonText}>Quit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MUSIC STAFF AREA */}
      <View style={styles.staffContainer}>
        <MusicStaff notes={sampleNotes} isPlaying={isPlaying} />
      </View>
    </SafeAreaView>
  );
};

export default TutorialScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  topBar: {
    height: 50,
    backgroundColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  songTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  topBarActions: {
    flexDirection: 'row',
  },
  topBarButton: {
    backgroundColor: '#FFA726',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  topBarButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  staffContainer: {
    flex: 1,
    position: 'relative',
  },

  // START & QUIT MODALS
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#42A5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
