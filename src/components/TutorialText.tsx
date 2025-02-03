import React from 'react';
import { Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const TutorialText = ({ text, delay = 500 }) => {
  return (
    <Animatable.Text
      animation="fadeInUp"
      delay={delay}
      style={styles.text}
      useNativeDriver
    >
      {text}
    </Animatable.Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default TutorialText;
