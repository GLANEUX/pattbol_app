import React from 'react';
import { View, StyleSheet } from 'react-native';
import RotatingLogo from './RotatingLogo';

const LoadingIndicator = ({ source, size = 100 }) => {
  return (
    <View style={styles.overlay}>
      <RotatingLogo source={source} size={size} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    zIndex: 1000, // ensure the loading indicator is on top
  },
});

export default LoadingIndicator;
