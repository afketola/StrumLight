// src/components/PauseOverlay.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PauseOverlayProps {
  visible: boolean;
  message: string;
}

const PauseOverlay: React.FC<PauseOverlayProps> = ({ visible, message }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default PauseOverlay;
