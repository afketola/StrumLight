import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  colors?: string[];
}

/**
 * GradientButton
 * - A reusable gradient-based button.
 */
const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  style,
  colors = ['#FF9800', '#FFA726'],
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={style}>
      <LinearGradient
        colors={colors}
        style={styles.gradient}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
