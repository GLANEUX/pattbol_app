import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../../common/LoadingIndicator';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { authContext } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();


  
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
            <TextInput
        placeholder="Mot de passe"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="S'inscrire" onPress={handleSignUp} />
      {loading && <LoadingIndicator />}
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
