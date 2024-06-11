import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../../common/LoadingIndicator';
const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { authContext, state } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();



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
      <Button title="Se connecter" onPress={handleSignIn} />
      {loading && <LoadingIndicator />}
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
