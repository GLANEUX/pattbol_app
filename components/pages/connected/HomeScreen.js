// ./components/pages/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  
  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default HomeScreen;
