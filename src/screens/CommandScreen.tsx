// src/screens/CommandScreen.tsx
import React, { useContext, useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  ScrollView
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import base64 from 'react-native-base64';
import { BluetoothContext } from '../context/BluetoothContext';

import CircleOfFifths from '../components/CircleOfFifths';
import ChordDiagram from '../components/ChordDiagram';

// Map "LOW E", "A", etc. to indexes 0..5 for string statuses
const stringIndexMap: Record<string, number> = {
  "LOW E": 0,
  "A": 1,
  "D": 2,
  "G": 3,
  "B": 4,
  "HIGH E": 5,
};

// Example chord types
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

  // For DropDownPicker
  const [open, setOpen] = useState(false);

  // Called when user taps a wedge => base note changes
  const handleSelectKey = (keyName: string) => {
    setBaseNote(keyName);
    setStringStatuses(Array(6).fill("NO_NOTE"));
    sendCommand(keyName, chordType);
  };

  // Called when user picks chord type
  const handleChordTypeChange = (type: string) => {
    setChordType(type);
    setStringStatuses(Array(6).fill("NO_NOTE"));
    sendCommand(baseNote, type);
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
        const raw = base64.decode(characteristic.value);
        console.log("Received message:", raw);
        parseBLEMessage(raw);
      }
    );

    return () => {
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    };
  }, [connectedDevice]);

  // e.g. "CHORD: C Major; STATUS: Low E:CORRECT,A:HIGHER..."
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
        {/* Circle of Fifths */}
        <CircleOfFifths
          size={circleSize}
          onSelectKey={handleSelectKey}
          selectedKey={baseNote}
        />

        {/* Row with chord type dropdown + chord name */}
        <View style={styles.row}>
          <View style={styles.dropdownWrapper}>
            <DropDownPicker
              open={open}
              value={chordType}
              items={chordTypeItems}
              setOpen={setOpen}
              setValue={(cb) => {
                const val = typeof cb === 'function' ? cb(chordType) : cb;
                handleChordTypeChange(val);
              }}
              setItems={() => {}}
              placeholder="Type"
              style={styles.dropdown}
              containerStyle={{ width: 120 }}
              zIndex={9999}
            />
          </View>

        </View>

        {/* Chord Diagram at the bottom */}
        <View style={styles.diagramContainer}>
          <ChordDiagram chordName={parsedChordName} stringStatuses={stringStatuses} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommandScreen;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1, backgroundColor: '#FFF',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    // center them horizontally
    justifyContent: 'center',
  },
  dropdownWrapper: {
    marginRight: 15,
  },
  dropdown: {
    backgroundColor: '#fff',
  },
  chordName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  diagramContainer: {
    marginTop: 10,
    marginBottom: 30, // ensure we have space at the bottom
  },
});
