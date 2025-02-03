import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { useNavigation } from '@react-navigation/native';

const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
const CHARACTERISTIC_UUID = "abcd1234-5678-1234-5678-abcdef123456";
const DEVICE_NAME = "Strumlight-ESP";

const BluetoothSetupScreen = () => {
    const [manager] = useState(new BleManager());
    const [device, setDevice] = useState(null);
    const [connected, setConnected] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        requestBluetoothPermissions();
        return () => manager.destroy(); // Cleanup on unmount
    }, []);

    /** Request Bluetooth Permissions for Android 12+ */
    const requestBluetoothPermissions = async () => {
        if (Platform.OS === "android" && Platform.Version >= 31) {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
            ]);
            if (
                granted["android.permission.BLUETOOTH_SCAN"] !== PermissionsAndroid.RESULTS.GRANTED ||
                granted["android.permission.BLUETOOTH_CONNECT"] !== PermissionsAndroid.RESULTS.GRANTED
            ) {
                Alert.alert("Permission Denied", "Please enable Bluetooth permissions in settings.");
            }
        }
    };

    /** Scan and Connect to ESP32 */
    const connectToDevice = async () => {
        try {
            console.log("Scanning for devices...");
            manager.startDeviceScan(null, null, (error, scannedDevice) => {
                if (error) {
                    console.error("Scan error:", error);
                    return;
                }
                if (scannedDevice?.name === DEVICE_NAME) {
                    console.log("Found device:", scannedDevice.name);
                    manager.stopDeviceScan();
                    connect(scannedDevice);
                }
            });

            setTimeout(() => {
                manager.stopDeviceScan();
                if (!device) {
                    Alert.alert("Error", "No Strumlight-ESP device found.");
                }
            }, 10000); // Scan for 10 seconds

        } catch (error) {
            console.error("Bluetooth connection error:", error);
            Alert.alert("Connection Failed", "Could not connect to Bluetooth device.");
        }
    };

    /** Connect to the ESP32 BLE Device */
    const connect = async (device) => {
        try {
            console.log("Connecting to", device.name);
            const connectedDevice = await device.connect();
            await connectedDevice.discoverAllServicesAndCharacteristics();
            setConnected(true);
            setDevice(connectedDevice);
            Alert.alert("Connected", "Successfully connected to Strumlight-ESP!");

            // Navigate to Home Screen after successful connection
            setTimeout(() => {
                navigation.replace('Home');
            }, 1500);
            
        } catch (error) {
            console.error("Connection error:", error);
            Alert.alert("Connection Failed", "Could not establish Bluetooth connection.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🔗 Connect to StrumLight</Text>
            <Text style={styles.subtitle}>Turn on your StrumLight and press the button below to connect.</Text>

            <TouchableOpacity style={styles.button} onPress={connectToDevice}>
                <Text style={styles.buttonText}>{connected ? "Connected!" : "Connect to Strumlight-ESP"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: "#444",
        textAlign: "center",
        marginBottom: 30,
    },
    button: {
        width: 250,
        padding: 15,
        borderRadius: 25,
        backgroundColor: "#007AFF",
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
});

export default BluetoothSetupScreen;
