// File:  ./components/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { authContext, state } = React.useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (!state.userToken) {
      // Rediriger vers la page de connexion si aucun token n'est disponible
      navigation.navigate('SignIn');
    } else {
      const fetchUsers = async () => {
        try {
          const response = await fetch('https://api.pattbol.fr/users', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `${state.userToken}`
            }
          });

          if (response.ok) {
            const usersData = await response.json();
            setUsers(usersData);
          } else {
            const errorData = await response.json();
            Alert.alert('Error', errorData.message || 'Failed to fetch users');
          }
        } catch (error) {
          Alert.alert('Error', 'An error occurred. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchUsers();
    }
  }, [state.userToken]);

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text>Username: {item.username}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Role: {item.role}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Sign Out" onPress={authContext.signOut} />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
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
