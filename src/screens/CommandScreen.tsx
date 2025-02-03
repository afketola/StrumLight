import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
const CHARACTERISTIC_UUID = "abcd1234-5678-1234-5678-abcdef123456";

let device, server, service, characteristic;

const connectBluetooth = async () => {
    try {
        device = await navigator.bluetooth.requestDevice({
            filters: [{ name: "Strumlight-ESP" }],
            optionalServices: [SERVICE_UUID]
        });

        server = await device.gatt.connect();
        service = await server.getPrimaryService(SERVICE_UUID);
        characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);
        
        console.log("Connected to ESP32 BLE Server");
        return true;
    } catch (error) {
        console.error("Bluetooth connection error:", error);
        return false;
    }
};

const sendCommand = async (command) => {
    if (!characteristic) {
        console.log("Not connected to ESP32!");
        return;
    }
    let encoder = new TextEncoder();
    await characteristic.writeValue(encoder.encode(command));
    console.log(`Sent command: ${command}`);
};

const CommandTestScreen = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const navigation = useNavigation();

    const handleConnect = async () => {
        setIsConnecting(true);
        const success = await connectBluetooth();
        setConnected(success);
        setIsConnecting(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🔧 BLE Command Test</Text>
            <Text style={styles.subtitle}>Send commands to the StrumLight ESP32</Text>

            <TouchableOpacity onPress={handleConnect} activeOpacity={0.8}>
                <LinearGradient colors={['#FF6B6B', '#e6c65a']} style={styles.button}>
                    <Text style={styles.buttonText}>{isConnecting ? "Connecting..." : "Connect to Bluetooth"}</Text>
                </LinearGradient>
            </TouchableOpacity>

            {connected && (
                <>
                    <TouchableOpacity onPress={() => sendCommand("LED_ON")} activeOpacity={0.8}>
                        <LinearGradient colors={['#50C878', '#66FF99']} style={styles.button}>
                            <Text style={styles.buttonText}>Turn LED On</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => sendCommand("LED_OFF")} activeOpacity={0.8}>
                        <LinearGradient colors={['#3380FF', '#66A3FF']} style={styles.button}>
                            <Text style={styles.buttonText}>Turn LED Off</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </>
            )}

            {isConnecting && <ActivityIndicator size="small" color="#3366FF" style={{ marginTop: 20 }} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
    title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    subtitle: { fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 30 },
    button: {
        width: 250,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        marginTop: 10,
    },
    buttonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});

export default CommandTestScreen;
