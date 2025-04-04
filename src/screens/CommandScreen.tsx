import React, { useContext, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import base64 from 'react-native-base64';
import { BluetoothContext } from '../context/BluetoothContext';

const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
const CHARACTERISTIC_UUID = "abcd1234-5678-1234-5678-abcdef123456";

// Chord objects for each ring.
const majorChords = [
  { root: "C", type: "Major" },
  { root: "G", type: "Major" },
  { root: "D", type: "Major" },
  { root: "A", type: "Major" },
  { root: "E", type: "Major" },
  { root: "B", type: "Major" },
  { root: "F#", type: "Major" },
  { root: "C#", type: "Major" },
  { root: "G#", type: "Major" },
  { root: "D#", type: "Major" },
  { root: "A#", type: "Major" },
  { root: "F", type: "Major" }
];

const minorChords = [
  { root: "A", type: "Minor" },
  { root: "E", type: "Minor" },
  { root: "B", type: "Minor" },
  { root: "F#", type: "Minor" },
  { root: "C#", type: "Minor" },
  { root: "G#", type: "Minor" },
  { root: "D#", type: "Minor" },
  { root: "A#", type: "Minor" },
  { root: "F", type: "Minor" },
  { root: "C", type: "Minor" },
  { root: "G", type: "Minor" },
  { root: "D", type: "Minor" }
];

const CommandScreen = () => {
  const { connected, connectedDevice } = useContext(BluetoothContext) || {};
  // Initially select the first major chord.
  const [selectedChord, setSelectedChord] = useState(majorChords[0]);
  const [feedback, setFeedback] = useState("");

  // Send BLE command based on the selected chord.
  const sendCommand = async (chord) => {
    const command = `SHOW:${chord.root}_${chord.type}_CHORD`;
    if (!connectedDevice || !connected) {
      Alert.alert("Not Connected", "Please connect to Strumlight-ESP first.");
      return;
    }
    try {
      const base64Command = base64.encode(command);
      await connectedDevice.writeCharacteristicWithoutResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Command
      );
      console.log("Sent command:", command);
    } catch (error) {
      console.error("Error sending command:", error);
      Alert.alert("Error", "Failed to send command");
    }
  };

  const handleKeyPress = (chord) => {
    setSelectedChord(chord);
    sendCommand(chord);
  };

  // Subscribe to BLE notifications.
  useEffect(() => {
    if (connectedDevice) {
      const subscription = connectedDevice.monitorCharacteristicForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.error("Notification error:", error);
            return;
          }
          const receivedMessage = base64.decode(characteristic.value);
          console.log("Received message:", receivedMessage);
          // Expected format: "B Major;Correct"
          const parts = receivedMessage.split(";");
          if (parts.length === 2) {
            const chordParts = parts[0].trim().split(" ");
            if (chordParts.length >= 2) {
              const root = chordParts[0];
              const type = chordParts.slice(1).join(" ");
              setSelectedChord({ root, type });
            }
            setFeedback(parts[1].trim());
          } else {
            setSelectedChord({ root: receivedMessage, type: "" });
            setFeedback("");
          }
        }
      );
      return () => subscription?.remove();
    }
  }, [connectedDevice]);

  // Layout calculations.
  const { width } = Dimensions.get('window');
  const containerSize = width * 0.9; // Larger container for outer ring
  const outerDiameter = containerSize; // Outer ring remains as is.
  const innerDiameter = containerSize * 0.65; // Increase inner ring diameter to move it out further.
  const outerRadius = outerDiameter / 2;
  const innerRadius = innerDiameter / 2;
  const buttonSize = 40;

  // Helper: check if chord is selected.
  const isSelected = (chord) =>
    chord.root === selectedChord.root && chord.type === selectedChord.type;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chord Selector</Text>
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.subtitle}>Tap a key to set the target chord</Text>
        <View style={[styles.circleWrapper, { width: containerSize, height: containerSize }]}>
          {/* Outer ring: Major chords */}
          {majorChords.map((chord, index) => {
            const angle = (2 * Math.PI * index) / majorChords.length - Math.PI / 2;
            const x = outerRadius + (outerRadius - buttonSize) * Math.cos(angle) - buttonSize / 2;
            const y = outerRadius + (outerRadius - buttonSize) * Math.sin(angle) - buttonSize / 2;
            const selectedStyle = isSelected(chord) ? styles.selectedButton : {};
            return (
              <TouchableOpacity
                key={`major-${chord.root}`}
                style={[styles.keyButton, { left: x, top: y, width: buttonSize, height: buttonSize }, selectedStyle]}
                onPress={() => handleKeyPress(chord)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isSelected(chord) ? ["#FFEB3B", "#FBC02D"] : ["#4CAF50", "#388E3C"]}
                  style={styles.gradientButton}
                >
                  <Text style={styles.keyText}>{chord.root}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}

          {/* Inner ring: Minor chords */}
          {minorChords.map((chord, index) => {
            const angle = (2 * Math.PI * index) / minorChords.length - Math.PI / 2;
            const x = outerRadius + (innerRadius - buttonSize) * Math.cos(angle) - buttonSize / 2;
            const y = outerRadius + (innerRadius - buttonSize) * Math.sin(angle) - buttonSize / 2;
            const selectedStyle = isSelected(chord) ? styles.selectedButton : {};
            return (
              <TouchableOpacity
                key={`minor-${chord.root}`}
                style={[styles.keyButton, { left: x, top: y, width: buttonSize, height: buttonSize }, selectedStyle]}
                onPress={() => handleKeyPress(chord)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isSelected(chord) ? ["#FFEB3B", "#FBC02D"] : ["#2196F3", "#1976D2"]}
                  style={styles.gradientButton}
                >
                  <Text style={styles.keyText}>{chord.root}</Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}

          {/* Center chord display */}
          <View style={styles.centerChord}>
            <Text style={styles.centerChordText}>
              {selectedChord.root} {selectedChord.type}
            </Text>
          </View>
        </View>

        {feedback ? (
          <Text style={[styles.feedbackText, feedback === "Correct" ? styles.correct : styles.incorrect]}>
            You are {feedback}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default CommandScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // centers vertically
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
  },
  circleWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  keyButton: {
    position: 'absolute',
  },
  selectedButton: {
    borderWidth: 3,
    borderColor: '#FFD54F', // Bright yellow for selected button
    borderRadius: 20,
  },
  gradientButton: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
  },
  centerChord: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -50 }, { translateY: -20 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerChordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#444',
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  correct: {
    color: 'green',
  },
  incorrect: {
    color: 'red',
  },
});
