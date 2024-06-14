import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigation } from '@react-navigation/native';

const CategoryListScreen = () => {
  const { state } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://api.pattbol.fr/products/categories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${state.userToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch categories');
        }

        const categoriesData = await response.json();
        setCategories(categoriesData.categories);
      } catch (error) {
        Alert.alert('Error', error.message || 'An error occurred. Please try again.');
      }
    };

    fetchCategories();
  }, [state.userToken]);

  const navigateToCategoryProducts = async (category) => {
    try {
      const response = await fetch(`https://api.pattbol.fr/products/category/${category}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${state.userToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch category products');
      }

      const productsData = await response.json();
      navigation.navigate('CategoryProductsScreen', { category, products: productsData.products });
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred. Please try again.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => navigateToCategoryProducts(item)}>
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Categories</Text>
      <FlatList
        data={categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
});

export default CategoryListScreen;
