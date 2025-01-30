import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const OnboardingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to StrumLight 🎸</Text>
      <Text style={styles.subtitle}>
        The future of interactive guitar learning starts here!
      </Text>

      {/* Gradient Button */}
      <TouchableOpacity onPress={() => navigation.navigate('BluetoothSetup')} activeOpacity={0.8}>
        <LinearGradient colors={['#FF6B6B', '#e6c65a', '#50C878', '#4682B4', '#9370DB']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </LinearGradient>
      </TouchableOpacity>
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
  button: {
    width: 250,
    height: 50, // Increased height for visibility
    borderRadius: 25, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default OnboardingScreen;
