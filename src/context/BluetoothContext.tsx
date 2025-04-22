// src/context/BluetoothContext.tsx

import React, { createContext, useState, useEffect } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'react-native-base64';
import { Alert } from 'react-native';

const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
const CHARACTERISTIC_UUID = "abcd1234-5678-1234-5678-abcdef123456";

interface BluetoothContextType {
  manager: BleManager;
  connectedDevice: Device | null;
  connected: boolean;
  connectToDevice: (device: Device) => Promise<void>;
  disconnectDevice: () => Promise<void>;
}

export const BluetoothContext = createContext<BluetoothContextType | null>(null);

export const BluetoothProvider = ({ children }: { children: React.ReactNode }) => {
  // 1) Single BleManager for the whole app
  const [manager] = useState(() => new BleManager());
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [connected, setConnected] = useState(false);

  // 2) Attempt auto-reconnect on app launch
  useEffect(() => {
    (async () => {
      try {
        const savedDeviceId = await AsyncStorage.getItem('SAVED_DEVICE_ID');
        if (savedDeviceId) {
          console.log("Attempting auto-reconnect to device:", savedDeviceId);
          // Connect to known device by ID
          const device = await manager.connectToDevice(savedDeviceId);
          await device.discoverAllServicesAndCharacteristics();

          setConnectedDevice(device);
          setConnected(true);

          // Send a test command upon auto-reconnect
          // Consider changing "TEST" to a command your device will process, e.g., "SHOW:TEST_CHORD"
          await sendCommand(device, "SHOW:TEST_CHORD");
        }
      } catch (error) {
        console.log("Auto-reconnect failed:", error);
      }
    })();

    // Optional: destroy manager on app close
    return () => {
      // manager.destroy();
    };
  }, [manager]);

  // 3) Manual connection logic (called from BluetoothSetupScreen)
  const connectToDevice = async (device: Device) => {
    try {
      console.log('Connecting to', device.id);
      const connectedDev = await device.connect();
      await connectedDev.discoverAllServicesAndCharacteristics();

      // Save the device ID in AsyncStorage so we can auto-reconnect later
      await AsyncStorage.setItem('SAVED_DEVICE_ID', connectedDev.id);

      setConnectedDevice(connectedDev);
      setConnected(true);

      // Send a test command upon first connection
      await sendCommand(connectedDev, "SHOW:TEST_CHORD");
    } catch (error) {
      console.error("connectToDevice error:", error);
      Alert.alert("Connection Failed", "Could not establish Bluetooth connection.");
    }
  };

  // 4) Disconnect if needed
  const disconnectDevice = async () => {
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
      setConnectedDevice(null);
      setConnected(false);
      await AsyncStorage.removeItem('SAVED_DEVICE_ID');
      console.log("Disconnected from device");
    }
  };

  // 5) Helper to send a command
  const sendCommand = async (device: Device, command: string) => {
    try {
      const base64Data = base64.encode(command);
      // Write without response (or use writeCharacteristicWithResponseForService)
      await device.writeCharacteristicWithoutResponseForService(
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        base64Data
      );
      console.log("Sent command:", command);
    } catch (error) {
      console.log("sendCommand error:", error);
    }
  };

  return (
    <BluetoothContext.Provider
      value={{
        manager,
        connectedDevice,
        connected,
        connectToDevice,
        disconnectDevice
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};