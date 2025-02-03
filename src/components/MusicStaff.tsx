import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';

const MusicStaff = () => {
  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        {[1, 2, 3, 4, 5].map((line) => (
          <Path
            key={line}
            path={Skia.Path.Make().moveTo(0, line * 20).lineTo(600, line * 20)}
            strokeWidth={2}
            color="white" // White staff for visibility
          />
        ))}
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
    width: 600, // Wide enough for moving notes
    height: 100,
  },
});

export default MusicStaff;
