import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { ListItem } from 'react-native-elements';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../../assets/styles/globalStyles';
import colors from '../../../assets/styles/colors';

const CategoryListScreen = () => {
  const { state } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontFamily: 'RouterMedium',
        fontSize: 30,
        color: colors.darkgreen,
      },
      headerStyle: {
        backgroundColor: colors.lightgrey,
      },
    });
  }, [navigation]);

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

  const navigateToCategoryProducts = async (category = '') => {
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

  return (
    <View style={styles.container}>
      {categories.map((category, index) => (
        <ListItem
          key={index}
          containerStyle={[
            styles.itemContainer,
            index === 0 && { borderTopLeftRadius: 10, borderTopRightRadius: 10 },
            index === categories.length - 1 && { borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
          ]}
          onPress={() => navigateToCategoryProducts(category)}
          bottomDivider={index !== categories.length - 1} // Ajout de bottomDivider uniquement sur tous les items sauf le dernier
        >
          <ListItem.Content>
            <ListItem.Title style={styles.itemText}>{category}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron color={colors.darkgreen} />
        </ListItem>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    margin: 20,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 0, // Aucun border radius par défaut
  },
  itemText: {
    fontFamily: 'RouterMedium',
    fontSize: 18,
  },
});

export default CategoryListScreen;
