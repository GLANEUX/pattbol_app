// ./components/pages/connected/HomeScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Button, FlatList, Alert } from 'react-native';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const HomeScreen = () => {
  const { state, authContext } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();

  const fetchHistory = async () => {
    try {
      if (!state.userToken) {
        return;
      }
  
      const Iduser = await fetch('https://api.pattbol.fr/users/user/id', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${state.userToken}`,
        },
      });
  
      if (!Iduser.ok) {
        authContext.signOut();
        return;
      }
      const userId = await Iduser.json();
  
      const response = await fetch(`https://api.pattbol.fr/products/history/${userId.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${state.userToken}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch history');
      }
  
      const historyData = await response.json();
      // Tri de l'historique du plus récent au plus ancien
      const sortedHistory = historyData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setHistory(sortedHistory);
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred. Please try again.');
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [state.userToken])
  );

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.product.title}</Text>
      <Button
        title="View Details"
        onPress={() => navigation.navigate('ProductDetailScreen', { productId: item.product.id })}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {history.length > 0 ? (
        <>
          <Text style={styles.heading}>History</Text>
          <FlatList
            data={history}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </>
      ) : (
        <View style={styles.noHistoryContainer}>
          <Text>No history available.</Text>
          <Button title="Search Products" onPress={() => navigation.navigate('Search')} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noHistoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
