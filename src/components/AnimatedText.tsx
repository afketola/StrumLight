import React from 'react';
import { Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const AnimatedText = ({ text, delay = 500, style }) => {
  return (
    <Animatable.Text animation="fadeInUp" delay={delay} style={[styles.text, style]}>
      {text}
    </Animatable.Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default AnimatedText;
