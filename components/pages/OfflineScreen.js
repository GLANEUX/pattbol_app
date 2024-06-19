// ./components/pages/OfflineScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import globalStyles from '../../assets/styles/globalStyles';
import colors from '../../assets/styles/colors';


const OfflineScreen = ({ onRefresh }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Veuillez vous connecter au Wi-Fi pour utiliser cette application.</Text>
      <TouchableOpacity style={styles.button} onPress={onRefresh}>
        <Text style={globalStyles.buttonText}>Actualiser</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.lightgrey
  },
  button:{
    ...globalStyles.button,
    marginTop:15,
    paddingHorizontal:0,
    width: '75%'
  }, 
  text:{
    ...globalStyles.text,
    paddingHorizontal:110,
    fontSize:20
  }, 
});

export default OfflineScreen;
