import React, { useState, useLayoutEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../hooks/AuthContext';
import LoadingIndicator from '../../common/LoadingIndicator';
import globalStyles from '../../../assets/styles/globalStyles';
import colors from '../../../assets/styles/colors';
const EditPasswordScreen = () => {
  const { state } = React.useContext(AuthContext);
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const { userId } = route.params;
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

  const handleUpdatePassword = async () => {


    setLoading(true);
    try {
      const response = await fetch(`https://api.pattbol.fr/users/modifyPassword/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${state.userToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la mise à jour du mot de passe');
      }

      console.log(responseData)
      const responseData = await response.json();
      Alert.alert('Succès', responseData.message || 'Mot de passe mis à jour avec succès');
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
        placeholder="Mot de passe actuel"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        style={globalStyles.input}
        placeholderTextColor={colors.darkgrey}

      />
      <TextInput
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
        style={globalStyles.input}
        placeholderTextColor={colors.darkgrey}

      />
      <TextInput
            placeholder="Confirmer le nouveau mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
        style={globalStyles.input}
        placeholderTextColor={colors.darkgrey}

      />
      <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
        <Text style={globalStyles.buttonText}>Mettre à jour le mot de passe</Text>
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

export default EditPasswordScreen;
