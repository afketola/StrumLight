// src/screens/CommandScreen.tsx
import React, { useContext, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import base64 from 'react-native-base64';
import { BluetoothContext } from '../context/BluetoothContext';
import CircleOfFifths from '../components/CircleOfFifths';
import ChordDiagram from '../components/ChordDiagram';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

// Map "LOW E", "A", etc. to indexes 0..5 for string statuses
const stringIndexMap: Record<string, number> = {
  "LOW E": 0,
  "A": 1,
  "D": 2,
  "G": 3,
  "B": 4,
  "HIGH E": 5,
};

// Example chord types with simplified design
const chordTypeItems = [
  { label: "Major", value: "Major" },
  { label: "Minor", value: "Minor" },
  { label: "7", value: "7" },
  { label: "Dim", value: "Dim" },
  { label: "Dim7", value: "Dim7" },
  { label: "Aug", value: "Aug" },
  { label: "Sus2", value: "Sus2" },
  { label: "Sus4", value: "Sus4" },
  { label: "maj7", value: "maj7" },
  { label: "m7", value: "m7" },
  { label: "7Sus4", value: "7Sus4" },
];

// Capo positions
const capoPositions = Array.from({ length: 13 }, (_, i) => ({
  label: i === 0 ? 'No Capo' : `Capo ${i}`,
  value: i
}));

const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
const CHARACTERISTIC_UUID = "abcd1234-5678-1234-5678-abcdef123456";

const CommandScreen = () => {
  const { connected, connectedDevice } = useContext(BluetoothContext) || {};

  // The base note from the circle
  const [baseNote, setBaseNote] = useState("C");
  // The chord type
  const [chordType, setChordType] = useState("Major");
  // The chord name from BLE or local combo
  const [parsedChordName, setParsedChordName] = useState("C Major");

  // The 6 string statuses
  const [stringStatuses, setStringStatuses] = useState(Array(6).fill("NO_NOTE"));
  const [allStringsCorrect, setAllStringsCorrect] = useState(false);

  // For DropDownPicker
  const [open, setOpen] = useState(false);

  // Capo position
  const [capoPosition, setCapoPosition] = useState(0);
  const [showCapoDropdown, setShowCapoDropdown] = useState(false);

  // Animation values
  const scrollX = new Animated.Value(0);
  const itemWidth = Dimensions.get('window').width / 3; // Show 3 items at a time

  // Called when user taps a wedge => base note changes
  const handleSelectKey = (keyName: string) => {
    setBaseNote(keyName);
    setStringStatuses(Array(6).fill("NO_NOTE"));
    const newChordName = `${keyName} ${chordType}`;
    setParsedChordName(newChordName);
    sendCommand(keyName, chordType);
  };

  // Called when user picks chord type
  const handleChordTypeChange = (type: string) => {
    setChordType(type);
    setStringStatuses(Array(6).fill("NO_NOTE"));
    const newChordName = `${baseNote} ${type}`;
    setParsedChordName(newChordName);
    sendCommand(baseNote, type);
  };

  const handleCapoChange = async (position: number) => {
    setCapoPosition(position);
    setShowCapoDropdown(false);
    
    if (!connectedDevice || !connected) {
      Alert.alert("Not Connected", "Please connect to Strumlight-ESP first.");
      return;
    }
    
    try {
      const command = `CAPO:${position}`;
      const base64Command = base64.encode(command);
      await connectedDevice.writeCharacteristicWithoutResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Command
      );
      console.log("Sent capo command:", command);
    } catch (err) {
      console.error("Error sending capo command:", err);
      Alert.alert("Error", "Failed to set capo position");
    }
  };

  // BLE command => "SHOW:C_Major_CHORD"
  const sendCommand = async (root: string, type: string) => {
    const shortType = type.replace(/\s+/g, "");
    const command = `SHOW:${root}_${shortType}_CHORD`;

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
    } catch (err) {
      console.error("Error sending command:", err);
      Alert.alert("Error", "Failed to send command");
    }
  };

  // BLE subscription
  useEffect(() => {
    if (!connectedDevice) return;

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
  }, [connectedDevice]);

  // Parse BLE message from device
  const parseBLEMessage = (msg: string) => {
    const [chordPart, statusPart] = msg.split(";");
    if (!chordPart || !statusPart) {
      console.log("Invalid message format");
      return;
    }
    
    const chordLabel = chordPart.replace("CHORD:", "").trim();
    setParsedChordName(chordLabel);

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
  };

  // Layout
  const { width } = Dimensions.get('window');
  // Slightly smaller circle to ensure enough vertical space
  const circleSize = Math.min(width * 0.85, 300);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* We'll skip a custom header to save space,
          relying on the default "Freestyle" from the stack. */}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Capo Button - now styled like the image */}
        <TouchableOpacity
          style={styles.capoButton}
          onPress={() => setShowCapoDropdown(!showCapoDropdown)}
        >
          <Text style={styles.capoButtonText}>
            {capoPosition === 0 ? 'No Capo' : `Capo ${capoPosition}`}
          </Text>
        </TouchableOpacity>

        {showCapoDropdown && (
          <View style={styles.capoDropdown}>
            <ScrollView>
              {capoPositions.map((pos) => (
                <TouchableOpacity
                  key={pos.value}
                  style={[
                    styles.capoOption,
                    pos.value === capoPosition && styles.capoOptionSelected
                  ]}
                  onPress={() => handleCapoChange(pos.value)}
                >
                  <Text style={[
                    styles.capoOptionText,
                    pos.value === capoPosition && styles.capoOptionTextSelected
                  ]}>
                    {pos.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Circle of Fifths with chord name in center */}
        <View style={styles.circleContainer}>
          <CircleOfFifths
            size={circleSize}
            onSelectKey={handleSelectKey}
            selectedKey={baseNote}
          />
          <View style={styles.centerChordName}>
            <Text style={styles.centerChordText}>{parsedChordName}</Text>
          </View>
        </View>

        {/* Simplified Horizontal Chord Type Selector */}
        <View style={styles.chordTypeContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chordTypeScroll}
            snapToInterval={itemWidth}
            decelerationRate="fast"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
          >
            {chordTypeItems.map((item, index) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.chordTypeItem,
                  chordType === item.value && styles.chordTypeItemSelected,
                ]}
                onPress={() => handleChordTypeChange(item.value)}
              >
                <Text style={[
                  styles.chordTypeText,
                  chordType === item.value && styles.chordTypeTextSelected
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chord Diagram */}
        <View style={styles.chordContainer}>
          <Text style={styles.chordTitle}>
            Current Chord: {parsedChordName}
          </Text>
          <ChordDiagram 
            chordName={parsedChordName} 
            stringStatuses={stringStatuses}
          />
          {allStringsCorrect && (
            <View style={styles.correctIndicator}>
              <Text style={styles.correctText}>CORRECT!</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommandScreen;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  centerChordName: {
    position: 'absolute',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 40,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  centerChordText: {
    fontSize: 24,
    color: '#333',
  },
  chordTypeContainer: {
    height: 40,
    marginBottom: 20,
  },
  chordTypeScroll: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  chordTypeItem: {
    height: 36,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
  },
  chordTypeItemSelected: {
    backgroundColor: '#3b5998',
  },
  chordTypeText: {
    fontSize: 15,
    color: '#666',
  },
  chordTypeTextSelected: {
    color: '#FFF',
  },
  chordContainer: {
    marginTop: 10,
  },
  chordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
  capoButton: {
    backgroundColor: '#3b5998',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  capoButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  capoDropdown: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 5,
    maxHeight: 200,
    width: 120,
    zIndex: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  capoOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  capoOptionSelected: {
    backgroundColor: '#f0f8ff',
  },
  capoOptionText: {
    fontSize: 14,
    color: '#333',
  },
  capoOptionTextSelected: {
    color: '#3b5998',
  },
});
