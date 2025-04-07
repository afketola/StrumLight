// src/screens/TutorialScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const TutorialScreen = ({ navigation }) => {
  const handleStartDemo = () => {
    navigation.navigate('DemoSong');  // We'll define DemoSongScreen next
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Strumlight!</Text>
      <Text style={styles.text}>
        We’ll show you how to play “Enter Sandman” with Strumlight feedback.
        When you’re ready, rotate your screen and click Start.
      </Text>
      <Button title="Start Demo" onPress={handleStartDemo} />
    </View>
  );
};

export default TutorialScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});
