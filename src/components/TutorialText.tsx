import React from 'react';
import { Text, StyleSheet } from 'react-native';

/**
 * TutorialText
 * - Displays simple instructions or descriptive text.
 * - Could be integrated with AnimatedText if needed.
 */
const TutorialText: React.FC<{ text: string }> = ({ text }) => {
  return <Text style={styles.text}>{text}</Text>;
};

export default TutorialText;

const styles = StyleSheet.create({
  text: {
    color: '#FFF',
    fontSize: 16,
    marginVertical: 8,
  },
});
