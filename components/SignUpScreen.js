// File:  ./components/SignUpScreen.js
import React from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { AuthContext } from './AuthContext';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { authContext } = React.useContext(AuthContext);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      // Remplacez cette URL par l'URL de votre API d'inscription
      const response = await fetch("https://api.pattbol.fr/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        Alert.alert('Inscription réussie', 'Vous êtes maintenant inscrit', [
          { text: 'OK', onPress: () => navigation.navigate('SignIn') }
        ]);
      } else {
        const errorResult = await response.json();
        Alert.alert('Échec de l\'inscription', errorResult.error);
      }
    } catch (error) {
      Alert.alert('Échec de l\'inscription', 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Pseudo"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
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
      <Button title="S'inscrire" onPress={handleSignUp} />
      <Text style={styles.text}>
        Vous avez déjà un compte ?
        <Text style={{ color: 'blue' }} onPress={() => navigation.navigate('SignIn')}> Connectez-vous ici </Text>
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

export default SignUpScreen;
