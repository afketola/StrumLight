import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Circle } from '@shopify/react-native-skia';
import { useSharedValue, withTiming, Easing, runOnUI } from 'react-native-reanimated';

const AnimatedNote = () => {
  const x = useSharedValue(600); // Start off-screen on the right

  React.useEffect(() => {
    runOnUI(() => {
      'worklet'; // Marks this function as a worklet
      x.value = withTiming(-100, {
        duration: 4000, // Move across the screen in 4 seconds
        easing: Easing.linear,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Circle cx={x} cy={50} r={12} color="white" />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    width: 600,
    height: 100,
  },
});

export default AnimatedNote;
