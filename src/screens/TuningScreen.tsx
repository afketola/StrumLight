// TuningScreen.tsx
import React, { useContext, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { BluetoothContext } from '../context/BluetoothContext';
import base64 from 'react-native-base64';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TUNER_WIDTH = SCREEN_WIDTH * 0.85;
const DOT_SIZE = 8;
const MAX_DOTS = 11; // Number of dots to show on each side
const CENTER_DOT_SIZE = 12;

const STRING_NAMES = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'];
const TARGET_FREQUENCIES = [329.63, 246.94, 196.00, 146.83, 110.00, 82.41];
const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
const CHARACTERISTIC_UUID = "abcd1234-5678-1234-5678-abcdef123456";

interface TunerData {
  frequencies: number[];
  status: ('CORRECT' | 'HIGH' | 'LOW' | 'NONE')[];
  deviations: number[]; // -1 to 1, representing how far from correct
}

const TuningScreen = () => {
  const navigation = useNavigation();
  const bluetoothContext = useContext(BluetoothContext);
  const connected = bluetoothContext?.connected ?? false;
  const connectedDevice = bluetoothContext?.connectedDevice;

  const [tunerData, setTunerData] = useState<TunerData>({
    frequencies: Array(6).fill(0),
    status: Array(6).fill('NONE'),
    deviations: Array(6).fill(0)
  });

  useEffect(() => {
    if (!connected || !connectedDevice) return;

    const subscription = connectedDevice.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error || !characteristic?.value) return;

        try {
          const data = base64.decode(characteristic.value);
          const [command, freqStr] = data.split(';');
          
          if (command === 'Tuner') {
            const frequencies = freqStr.split(',').map(f => parseFloat(f));
            const deviations = frequencies.map((freq, idx) => {
              // Calculate deviation between -1 and 1
              // This should be adjusted based on your actual frequency comparison logic
              return Math.max(-1, Math.min(1, (freq - TARGET_FREQUENCIES[idx]) / 5));
            });
            
            const status = deviations.map(dev => {
              if (Math.abs(dev) <= 0.1) return 'CORRECT';
              return dev > 0 ? 'HIGH' : 'LOW';
            });

            setTunerData({ frequencies, status, deviations });
          }
        } catch (err) {
          console.error('Error parsing tuner data:', err);
        }
      }
    );

    return () => subscription.remove();
  }, [connected, connectedDevice]);

  const renderDots = (stringIndex: number) => {
    const deviation = tunerData.deviations[stringIndex];
    const status = tunerData.status[stringIndex];
    
    // Calculate which dot should be lit based on deviation
    const activeDotIndex = Math.round(deviation * MAX_DOTS) + MAX_DOTS;
    
    return (
      <View style={styles.dotsContainer}>
        {Array.from({ length: MAX_DOTS * 2 + 1 }).map((_, index) => {
          const isCenter = index === MAX_DOTS;
          const isActive = index === activeDotIndex;
          
          let dotColor = '#E0E0E0'; // Default color
          if (isActive) {
            if (status === 'CORRECT') dotColor = '#4CAF50';
            else if (status === 'HIGH') dotColor = '#FF9800';
            else if (status === 'LOW') dotColor = '#F44336';
          }
          
          return (
            <View
              key={index}
              style={[
                styles.dot,
                isCenter ? styles.centerDot : null,
                {
                  width: isCenter ? CENTER_DOT_SIZE : DOT_SIZE,
                  height: isCenter ? CENTER_DOT_SIZE : DOT_SIZE,
                  backgroundColor: isCenter ? '#333' : dotColor,
                  opacity: isCenter ? 0.2 : 1
                }
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.navigationBar}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="chevron-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Tuner</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.tunerDisplay}>
          {STRING_NAMES.map((name, index) => (
            <View key={name} style={styles.stringRow}>
              <Text style={styles.stringName}>{name}</Text>
              <View style={styles.stringLine} />
              {renderDots(index)}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  rightPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  tunerDisplay: {
    width: TUNER_WIDTH,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  stringName: {
    width: 40,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  stringLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
    marginHorizontal: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 60,
    right: 0,
    justifyContent: 'space-between',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#E0E0E0',
  },
  centerDot: {
    width: CENTER_DOT_SIZE,
    height: CENTER_DOT_SIZE,
    borderRadius: CENTER_DOT_SIZE / 2,
    backgroundColor: '#333',
  },
});

export default TuningScreen;
