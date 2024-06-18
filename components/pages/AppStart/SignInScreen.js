import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../../common/LoadingIndicator';
import globalStyles from '../../../assets/styles/globalStyles';
import colors from '../../../assets/styles/colors';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { authContext, state } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center', 
      headerLeft: () => (
        <Text onPress={() => navigation.goBack()} style={globalStyles.cancelText}>Annuler</Text>
      ),
      headerTitleStyle: {
        fontFamily: 'RouterMedium', 
        color: colors.darkgreen
            },
            headerStyle: {
              backgroundColor: colors.lightgrey, // Changer la couleur de fond du header
            },
    });
  }, [navigation]);




  const handleSignIn = async () => {
    setLoading(true);
    try {
      await authContext.signIn({ email, password });
    } catch (error) {
      Alert.alert('Échec de la connexion', 'Une erreur s\'est produite. Veuillez réessayer.');
      authContext.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <TextInput
        placeholder="Addresse e-mail"
        value={email}
        onChangeText={setEmail}
        style={globalStyles.input}
        placeholderTextColor={colors.darkgrey}
 
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={globalStyles.input}
        placeholderTextColor={colors.darkgrey}

      />
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={globalStyles.buttonText}>Connexion</Text>
      </TouchableOpacity>
      {loading && <LoadingIndicator />}
      <Text style={styles.text}>Vous n'avez pas de compte ?</Text>
      <Text style={styles.textlink} onPress={() => navigation.navigate('Inscription')}>Inscrivez-vous</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button:{
    ...globalStyles.button,
    marginTop:15,
    paddingHorizontal:0,
    width: '75%'
  },   

  text: {
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'RouterMedium',
    fontSize: 14,
    textAlignVertical: 'center',
    color: colors.darkgrey
  },

  textlink: {
    color: colors.orange,
    fontSize: 14,
    fontFamily: 'RouterMedium'

  }
});

export default SignInScreen;
