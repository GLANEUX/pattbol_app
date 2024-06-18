import React, { useState, useLayoutEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../../common/LoadingIndicator';
import globalStyles from '../../../assets/styles/globalStyles';
import colors from '../../../assets/styles/colors';
const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { authContext } = React.useContext(AuthContext);
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
        color: colors.darkgreen, 
      },
    });
  }, [navigation]);
  



  const handleSignUp = async () => {
    setLoading(true);
    try {
      await authContext.signUp({ username, email, password, confirmPassword });
    } catch (error) {
      Alert.alert('Échec de l\'inscription', 'Une erreur s\'est produite. Veuillez réessayer.');
      authContext.signOut();
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };


  return (
    <View style={globalStyles.container}>
      <TextInput
        placeholder="Pseudo"
        value={username}
        onChangeText={setUsername}
        style={globalStyles.input}
        placeholderTextColor={colors.darkgrey}

      />
      <TextInput
        placeholder="Email"
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
      <TextInput
        placeholder="Mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={globalStyles.input}
        placeholderTextColor={colors.darkgrey}

      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={globalStyles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>
      {loading && <LoadingIndicator />}
      <Text style={styles.text}>Vous avez déjà un compte ?</Text>
      <Text style={styles.textlink} onPress={() => navigation.navigate('Connexion')}>Connectez-vous</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    ...globalStyles.button,
    marginTop: 15,
    paddingHorizontal: 0,
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
export default SignUpScreen;
