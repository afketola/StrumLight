// BluetoothSetupScreen.tsx
import React, { useEffect, useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BluetoothContext } from '../context/BluetoothContext';

const DEVICE_NAME = "Strumlight-ESP";

const BluetoothSetupScreen = () => {
  const bluetooth = useContext(BluetoothContext);
  if (!bluetooth) {
    throw new Error("BluetoothContext not found. Make sure you're wrapping the app in <BluetoothProvider>.");
  }

  const { manager, connectToDevice, connected } = bluetooth;
  const [isScanning, setIsScanning] = useState(false);
  const navigation = useNavigation();

  // 1) If we are already connected, skip this screen
  useEffect(() => {
    if (connected) {
      navigation.replace('Home');
    }
  }, [connected, navigation]);

  useEffect(() => {
    requestBluetoothPermissions();
  }, []);

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ]);
      if (
        granted['android.permission.BLUETOOTH_SCAN'] !== PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.BLUETOOTH_CONNECT'] !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        Alert.alert('Permission Denied', 'Please enable Bluetooth permissions in settings.');
      }
    }
  };

  const scanAndConnect = () => {
    setIsScanning(true);
    console.log("Scanning for devices...");

    manager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.error('Scan error:', error);
        setIsScanning(false);
        return;
      }
      if (scannedDevice?.name === DEVICE_NAME) {
        console.log('Found device:', scannedDevice.name);
        manager.stopDeviceScan();
        connectToDevice(scannedDevice)
          .then(() => {
            setTimeout(() => {
              navigation.replace('Home');
            }, 1500);
          })
          .catch((err) => console.error(err));
      }
    });

    // Stop scanning after 10s if no device found
    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔗 Connect to StrumLight</Text>
      <Text style={styles.subtitle}>
        Turn on your StrumLight and press the button below to connect.
      </Text>

      <TouchableOpacity style={styles.button} onPress={scanAndConnect}>
        <Text style={styles.buttonText}>{isScanning ? 'Scanning...' : 'Connect to Strumlight-ESP'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BluetoothSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 20,
  },
  title: {
    fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10,
  },
  subtitle: {
    fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 30,
  },
  button: {
    width: 250, padding: 15, borderRadius: 25, backgroundColor: '#007AFF', alignItems: 'center', marginVertical: 10,
  },
  buttonText: {
    fontSize: 18, color: '#fff', textAlign: 'center', fontWeight: 'bold',
  },
});
