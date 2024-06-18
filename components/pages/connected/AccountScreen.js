import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../hooks/AuthContext';
import LoadingIndicator from '../../common/LoadingIndicator';
import { ListItem } from 'react-native-elements';
import globalStyles from '../../../assets/styles/globalStyles';
import colors from '../../../assets/styles/colors';
import { color } from 'react-native-elements/dist/helpers';

const AccountScreen = () => {
  const { authContext, state } = React.useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmPassword, setPassword] = useState('');
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontFamily: 'RouterMedium',
        fontSize: 30,
        color: colors.darkgreen
      },
      headerStyle: {
        backgroundColor: 'white', // Changer la couleur de fond du header
      },
    });
  }, [navigation]);

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
        throw new Error(errorData.message || 'Failed to fetch user data');
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
      Alert.alert('Utilisateur Supprimé', responseData.message || 'Vous avez supprimé votre compte');
      authContext.signOut();
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const renderUserInfo = () => {
    return (
      <View>
        <ListItem
                onPress={() => navigation.navigate('EditUserScreen', { userId: user.id })}
                containerStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10}}
>
          <ListItem.Content>
            <ListItem.Title>Nom d'utilisateur:</ListItem.Title>
            <ListItem.Subtitle>{user.username}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron color={colors.darkgreen} />

        </ListItem>
        <ListItem
          onPress={() => navigation.navigate('EditUserScreen', { userId: user.id })}
          containerStyle={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginBottom:15}}
>
          <ListItem.Content>
            <ListItem.Title>Email:</ListItem.Title>
            <ListItem.Subtitle>{user.email}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron color={colors.darkgreen} />

        </ListItem>



        <ListItem onPress={() => navigation.navigate('EditPasswordScreen', { userId: user.id })}
                    containerStyle={{ borderRadius: 10,  marginBottom:15}}
>
          <ListItem.Content>
            <ListItem.Title>Modifier mon mot de passe</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron color={colors.darkgreen} />

        </ListItem>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingIndicator />
      ) : (
        user && (
          <View>
            {renderUserInfo()}
            <View style={styles.buttonsContainer}>

            <TouchableOpacity style={globalStyles.button} onPress={authContext.signOut}>
              <Text style={globalStyles.buttonText}>Déconnexion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
              <Text style={globalStyles.buttonText}>Supprimer le compte</Text>
            </TouchableOpacity>
            </View>
          </View>
        )
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Voulez-vous vraiment supprimer votre compte ?</Text>
            <TextInput
              placeholder="Mot de passe"
              value={confirmPassword}
              onChangeText={setPassword}
              secureTextEntry
              style={globalStyles.input}
            />



<View style={styles.buttonsContainer}>

<TouchableOpacity style={globalStyles.button}onPress={() => setModalVisible(false)}>
  <Text style={globalStyles.buttonText}>Annuler</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
  <Text style={globalStyles.buttonText}>Supprimer le compte</Text>
</TouchableOpacity>
</View>
            
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,

  },
  button: {
    ...globalStyles.button,

    backgroundColor: "#FF3838",
    padding: 16,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal:20
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: colors.red,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  arrow: {
    color: 'gray',
    fontSize: 16,
  },
});

export default AccountScreen;
