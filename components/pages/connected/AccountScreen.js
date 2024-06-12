import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, Text, Button, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../hooks/AuthContext';
import LoadingIndicator from '../../common/LoadingIndicator';

const AccountScreen = () => {
  const { authContext, state } = React.useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [confirmPassword, setPassword] = useState('');

  const fetchUser = useCallback(async () => {
    if (!state.userToken) {
      return;
    }

    try {
      const response = await fetch('https://api.pattbol.fr/users/user/id', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${state.userToken}`,
        },
      });

      if (!response.ok) {
        authContext.signOut();
        return;
      }

      const userId = await response.json();

      const userResponse = await fetch(`https://api.pattbol.fr/users/${userId.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${state.userToken}`,
        },
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.message || errorData.message || 'Failed to fetch user data');
      }

      const userData = await userResponse.json();
      setUser(userData);
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [state.userToken, authContext]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [fetchUser])
  );

  const handleDeleteAccount = async () => {
    setLoading(true);
    if (!state.userToken) {
      return;
    }

    try {
      const responses = await fetch('https://api.pattbol.fr/users/user/id', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${state.userToken}`,
        },
      });

      if (!responses.ok) {
        authContext.signOut();
        return;
      }

      const userId = await responses.json();

      const response = await fetch(`https://api.pattbol.fr/users/${userId.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${state.userToken}`,
        },
        body: JSON.stringify({ confirmPassword }), 

      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la suppression');
      }
      const responseData = await response.json();

      Alert.alert('Utilisateur Supprimer', responseData.message || 'Vous avez supprimer votre compte');

      authContext.signOut();
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingIndicator />
      ) : (
        user && (
          <View>
            <TouchableOpacity style={styles.userItem} onPress={() => navigation.navigate('EditUserScreen', { userId: user.id })}>
              <Text>Username: {user.username}</Text>
              <Text style={styles.arrow}>V</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userItem} onPress={() => navigation.navigate('EditUserScreen', { userId: user.id })}>
              <Text>Email: {user.email}</Text>
              <Text style={styles.arrow}>V</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.userItem} onPress={() => navigation.navigate('EditPasswordScreen', { userId: user.id })}>
              <Text>Modifier mon mot de passe</Text>
              <Text style={styles.arrow}>V</Text>
            </TouchableOpacity>
          </View>
        )
      )}
      <Button title="Se déconnecter" onPress={authContext.signOut} />
      <Button title="Supprimer le compte" onPress={() => setModalVisible(true)} />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
<View style={styles.modalContent}>
  <Text>Voulez-vous vraiment supprimer votre compte ?</Text>
  <TextInput
    placeholder="Mot de passe"
    value={confirmPassword}
    onChangeText={setPassword}
    secureTextEntry
    style={styles.input}
  />
  <Button title="Annuler" onPress={() => setModalVisible(false)} />
  <Button title="Supprimer le compte" onPress={handleDeleteAccount} />
</View>

      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  arrow: {
    color: 'gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    flex: 1, // Ajout de flex: 1

    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default AccountScreen;
