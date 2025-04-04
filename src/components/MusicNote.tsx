// MusicNote.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface MusicNoteProps {
  pitch: string;
}

const MusicNote: React.FC<MusicNoteProps> = ({ pitch }) => {
  return (
    <View style={styles.container}>
      <Svg width={40} height={40} viewBox="0 0 290.281 290.281">
        <Path
          d="M205.367,0h-30v173.646c-6.239-2.566-13.111-3.922-20.305-3.922
             c-17.458,0-35.266,7.796-48.857,21.388c-25.344,25.343-28.516,63.407-7.072,84.853
             c9.232,9.232,22.016,14.316,35.995,14.316c17.458,0,35.266-7.796,48.857-21.388
             c11.843-11.843,19.308-26.842,21.018-42.234c0.244-2.198,0.355-4.38,0.355-6.537h0.01V0z"
          fill="#000000"
        />
      </Svg>
    </View>
  );
};

export default MusicNote;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
