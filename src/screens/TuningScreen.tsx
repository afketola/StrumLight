// TuningScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AudioRecord from 'react-native-audio-record';
import { YIN } from 'pitchfinder';
import Slider from '@react-native-community/slider';
import { frequencyToNoteName, frequencyToCents } from './helpers';

const TuningScreen = () => {
  const [frequency, setFrequency] = useState(0);
  const [note, setNote] = useState('');
  const [cents, setCents] = useState(0);

  useEffect(() => {
    // Initialize AudioRecord with desired options.
    const options = {
      sampleRate: 44100,  // default 44100 Hz
      channels: 1,        // mono
      bitsPerSample: 16,  // 16-bit
      wavFile: 'tuner.wav',
    };
    AudioRecord.init(options);
    AudioRecord.start();

    // Create a pitch detector using the YIN algorithm
    const detectPitch = YIN();

    // Subscribe to audio data events.
    const subscription = AudioRecord.on('data', data => {
      // data is a base64-encoded PCM chunk.
      // In a production app, you’d convert this to a Float32Array.
      // For this demo, we simulate processing by using a dummy array.
      const buffer = convertBase64ToFloat32Array(data);
      const pitch = detectPitch(buffer);
      if (pitch) {
        setFrequency(pitch);
        const { noteName, targetFrequency } = frequencyToNoteName(pitch);
        setNote(noteName);
        const centsOffset = frequencyToCents(pitch, targetFrequency);
        setCents(centsOffset);
      }
    });

    return () => {
      AudioRecord.stop();
      subscription.remove();
    };
  }, []);

  // Dummy conversion function – in a real implementation, decode base64 properly.
  function convertBase64ToFloat32Array(base64: string): Float32Array {
    // This is a placeholder. You’d use a proper base64-to-buffer conversion.
    // For demonstration, we return a dummy array.
    return new Float32Array(1024);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guitar Tuner</Text>
      <Text style={styles.frequency}>{frequency ? frequency.toFixed(2) : '--'} Hz</Text>
      <Text style={styles.note}>{note || '---'}</Text>
      <Slider
        style={styles.slider}
        minimumValue={-50}
        maximumValue={50}
        value={cents}
        disabled={true}
        minimumTrackTintColor="green"
        maximumTrackTintColor="red"
      />
      <Text style={styles.cents}>Offset: {cents ? cents.toFixed(1) : '0'} cents</Text>
    </View>
  );
};

export default TuningScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  frequency: {
    fontSize: 22,
    marginBottom: 10,
  },
  note: {
    fontSize: 20,
    marginBottom: 10,
  },
  slider: {
    width: 300,
    height: 40,
  },
  cents: {
    fontSize: 18,
    marginTop: 10,
  },
});
