// ./components/pages/AccountScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../hooks/AuthContext';
import LoadingIndicator from '../../common/LoadingIndicator';

const AccountScreen = () => {
  const { authContext, state } = React.useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
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
      } catch (error) {
        authContext.signOut();
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
          throw new Error('Failed to fetch user ID');
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
          throw new Error(errorData.message || errorData.error || 'Failed to fetch user data');
        }

        const userData = await userResponse.json();
        setUser(userData);
      } catch (error) {
        Alert.alert('Error', error.message || 'An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [state.userToken]);
    
  return (
    <View style={styles.container}>
      {loading ? (
         <LoadingIndicator />
      ) : (
        user && (
          <View style={styles.userItem}>
            <Text>Username: {user.username}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Role: {user.role}</Text>
          </View>
        )
      )}
      <Button title="Sign Out" onPress={authContext.signOut} />
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

export default AccountScreen;
