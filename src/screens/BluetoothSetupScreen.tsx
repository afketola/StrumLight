// BluetoothSetupScreen.tsx
import React, { useEffect, useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BluetoothContext } from '../context/BluetoothContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { BleManager, State } from 'react-native-ble-plx';

// Define the navigation param list type
type RootStackParamList = {
  Home: undefined;
  BluetoothSetup: undefined;
  // Add other screens as needed
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const DEVICE_NAME = "Strumlight-ESP";

const BluetoothSetupScreen = () => {
  const bluetooth = useContext(BluetoothContext);
  if (!bluetooth) {
    throw new Error("BluetoothContext not found. Make sure you're wrapping the app in <BluetoothProvider>.");
  }

  const { manager, connectToDevice, connected } = bluetooth;
  const [isScanning, setIsScanning] = useState(false);
  const [bluetoothState, setBluetoothState] = useState<State | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  // If we are already connected, skip this screen immediately
  useEffect(() => {
    if (connected) {
      navigation.replace('Home');
    }
  }, [connected, navigation]);

  // Check Bluetooth state and request permissions
  useEffect(() => {
    const checkBluetoothState = async () => {
      try {
        // Request permissions first
        await requestBluetoothPermissions();
        
        // Then check Bluetooth state
        const state = await manager.state();
        console.log("Bluetooth state:", state);
        setBluetoothState(state);
        
        // If Bluetooth is powered on, try to auto-connect
        if (state === State.PoweredOn) {
          autoConnect();
        } else {
          // If Bluetooth is not powered on, we'll show the setup screen
          setIsInitializing(false);
        }
      } catch (error) {
        console.error("Error checking Bluetooth state:", error);
        setIsInitializing(false);
      }
    };
    
    checkBluetoothState();
    
    // Set up a listener for Bluetooth state changes
    const subscription = manager.onStateChange((state) => {
      console.log("Bluetooth state changed:", state);
      setBluetoothState(state);
      
      if (state === State.PoweredOn) {
        autoConnect();
      } else {
        setIsInitializing(false);
      }
    }, true);
    
    return () => {
      subscription.remove();
    };
  }, [manager]);

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

  const autoConnect = () => {
    if (bluetoothState !== State.PoweredOn) {
      console.log("Bluetooth is not powered on, cannot scan");
      setIsInitializing(false);
      return;
    }
    
    setIsScanning(true);
    console.log("Auto-connecting to device...");

    try {
      manager.startDeviceScan(null, null, (error, scannedDevice) => {
        if (error) {
          console.error('Scan error:', error);
          setIsScanning(false);
          setIsInitializing(false);
          return;
        }
        if (scannedDevice?.name === DEVICE_NAME) {
          console.log('Found device:', scannedDevice.name);
          manager.stopDeviceScan();
          connectToDevice(scannedDevice)
            .then(() => {
              navigation.replace('Home');
            })
            .catch((err) => {
              console.error(err);
              setIsScanning(false);
              setIsInitializing(false);
            });
        }
      });

      // Stop scanning after 5s if no device found
      setTimeout(() => {
        manager.stopDeviceScan();
        setIsScanning(false);
        setIsInitializing(false);
      }, 5000);
    } catch (error) {
      console.error("Error starting scan:", error);
      setIsScanning(false);
      setIsInitializing(false);
    }
  };

  const scanAndConnect = () => {
    if (bluetoothState !== State.PoweredOn) {
      Alert.alert(
        "Bluetooth is not enabled",
        "Please enable Bluetooth to connect to your StrumLight device.",
        [{ text: "OK" }]
      );
      return;
    }
    
    setIsScanning(true);
    console.log("Scanning for devices...");

    try {
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
              navigation.replace('Home');
            })
            .catch((err) => {
              console.error(err);
              setIsScanning(false);
            });
        }
      });

      // Stop scanning after 10s if no device found
      setTimeout(() => {
        manager.stopDeviceScan();
        setIsScanning(false);
      }, 10000);
    } catch (error) {
      console.error("Error starting scan:", error);
      setIsScanning(false);
    }
  };

  const bypassBluetooth = () => {
    Alert.alert(
      "Bypass Bluetooth",
      "You can continue using the app without Bluetooth connection. Some features may be limited.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Continue",
          onPress: () => navigation.replace('Home')
        }
      ]
    );
  };

  // Show a loading screen while initializing
  if (isInitializing) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Connecting to StrumLight...</Text>
        <Text style={styles.subtitle}>Please wait</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔗 Connect to StrumLight</Text>
      <Text style={styles.subtitle}>
        {isScanning 
          ? "Searching for your StrumLight device..." 
          : bluetoothState !== State.PoweredOn
            ? "Please enable Bluetooth to connect to your device."
            : "Turn on your StrumLight and press the button below to connect."}
      </Text>

      <TouchableOpacity 
        style={[styles.button, (isScanning || bluetoothState !== State.PoweredOn) && styles.buttonDisabled]} 
        onPress={scanAndConnect}
        disabled={isScanning || bluetoothState !== State.PoweredOn}
      >
        <Text style={styles.buttonText}>
          {isScanning ? 'Scanning...' : 'Connect to Strumlight-ESP'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={bypassBluetooth}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          Continue without Bluetooth
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BluetoothSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16, 
    color: '#444', 
    textAlign: 'center', 
    marginBottom: 30,
  },
  button: {
    width: 250, 
    padding: 15, 
    borderRadius: 25, 
    backgroundColor: '#007AFF', 
    alignItems: 'center', 
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    fontSize: 18, 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#333',
  },
});
