import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const BluetoothSetupScreen = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const navigation = useNavigation();

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      navigation.navigate('Home');
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect to StrumLight 🎸</Text>
      <Text style={styles.subtitle}>
        Turn on your StrumLight device and press the button below to connect.
      </Text>

      <LottieView
        source={require('../assets/animations/bluetooth_connect.json')}
        autoPlay
        loop
        style={styles.lottie}
      />

      {/* Updated Button Placement & Gradient */}
      <TouchableOpacity onPress={handleConnect} activeOpacity={0.8}>
        <LinearGradient
          colors={['#FF6B6B', '#e6c65a', '#50C878', '#4682B4', '#9370DB']} // Updated gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{isConnecting ? "Connecting..." : "Connect 🎸"}</Text>
        </LinearGradient>
      </TouchableOpacity>

      {isConnecting && <ActivityIndicator size="small" color="#3366FF" style={{ marginTop: 20 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: '15%',
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
  lottie: {
    width: 250,
    height: 250,
    marginBottom: 20, 
  },
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
    marginTop: 10, // Matches OnboardingScreen
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default BluetoothSetupScreen;
