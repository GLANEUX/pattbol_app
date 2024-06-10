import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { authContext, state } = React.useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (!state.userToken) {
      // Rediriger vers la page de connexion si aucun token n'est disponible
      navigation.navigate('SignIn');
    } else {
      
      const fetchUser = async () => {
        try {

          const teuserId = await fetch(`https://api.pattbol.fr/users/user/id`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${state.userToken}`
            }
          });
          const userId = await teuserId.json();

          const response = await fetch(`https://api.pattbol.fr/users/${userId.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${state.userToken}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            const errorData = await response.json();
            Alert.alert('Error', errorData.message || errorData.error || 'Failed to fetch user data');
          }
        } catch (error) {
          Alert.alert('Error', 'An error occurred. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [state.userToken, navigation]);

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Sign Out" onPress={authContext.signOut} />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        user && (
          <View style={styles.userItem}>
            <Text>Username: {user.username}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Role: {user.role}</Text>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  userItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default HomeScreen;
