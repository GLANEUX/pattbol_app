// ./components/pages/OfflineScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const OfflineScreen = ({ onRefresh }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hors connexion</Text>
      <Button title="Actualiser" onPress={onRefresh} />
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
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default OfflineScreen;
