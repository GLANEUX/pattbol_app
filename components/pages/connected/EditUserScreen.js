import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../hooks/AuthContext';
import LoadingIndicator from '../../common/LoadingIndicator';
import globalStyles from '../../../assets/styles/globalStyles';
import colors from '../../../assets/styles/colors';
const EditUserScreen = () => {
  const { state } = React.useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

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


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`https://api.pattbol.fr/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${state.userToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Échec de la mise à jour du mot de passe');
        }

        const userDetails = await response.json();
        setUsername(userDetails.username);
        setEmail(userDetails.email);
      } catch (error) {
        Alert.alert('Erreur', error.message || 'Une erreur s\'est produite. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [state.userToken, userId]);

  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      const userResponse = await fetch(`https://api.pattbol.fr/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${state.userToken}`,
        },
        body: JSON.stringify({ username, email }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.message || 'Échec de la mise à jour des informations utilisateur');
      }

      const responseData = await userResponse.json();

      Alert.alert('Succès', responseData.message || 'Informations mises à jour avec succès');
      navigation.goBack(); 
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
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
      <TouchableOpacity style={styles.button} onPress={handleUpdateUser}>
        <Text style={globalStyles.buttonText}>Mettre à jour</Text>
      </TouchableOpacity>
        </>
      )}
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

});

export default EditUserScreen;
