// File:  ./components/SignInScreen.js
import React from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { AuthContext } from './AuthContext';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { authContext } = React.useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Se connecter" onPress={() => authContext.signIn({ email, password })} />
      <Text style={styles.text}>
        Vous n'avez pas de compte ?
        <Text style={{ color: 'blue' }} onPress={() => navigation.navigate('SignUp')}> Inscrivez-vous ici </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  text: {
    marginTop: 16,
    textAlign: 'center',
  },
});

export default SignInScreen;
