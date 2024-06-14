// ./components/pages/connected/ProductDetailScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Alert, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { AuthContext } from '../../hooks/AuthContext';

const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;
  const { state } = useContext(AuthContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://api.pattbol.fr/products/get/${productId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${state.userToken}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch product details');
        }

        const productData = await response.json();
        setProduct(productData.product); // Update here to access the correct part of the response
      } catch (error) {
        Alert.alert('Error', error.message || 'An error occurred. Please try again.');
      }
    };

    fetchProductDetails();
  }, [productId, state.userToken]);

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.label}>Brand: {product.brand}</Text>
      <Text style={styles.label}>Status: {product.statut}</Text>
      <Text style={styles.label}>Quantity: {product.quantity} {product.quantityUnit}</Text>
      <Text style={styles.label}>Rate: {product.rate}</Text>
      <Text style={styles.label}>Bar Code: {product.barCode}</Text>
      <Text style={styles.label}>Conditioning: {product.conditioning}</Text>
      <Text style={styles.label}>Ingredients List: {product.ingredientsList}</Text>
      <Text style={styles.label}>Added Vitamins: {product.addedVitamins}</Text>
      <Text style={styles.label}>Added Minerals: {product.addedMinerals}</Text>
      {product.picture && <Image source={{ uri: product.picture }} style={styles.image} />}
      {product.ingredientsPicture && <Image source={{ uri: product.ingredientsPicture }} style={styles.image} />}
      {product.nutricionalInformationPicture && <Image source={{ uri: product.nutricionalInformationPicture }} style={styles.image} />}
      <Text style={styles.label}>Nutritional Information:</Text>
      {product.nutricionalInformations.map(info => (
        <View key={info.id} style={styles.nutritionContainer}>
          <Text>{info.name}: {info.value} {info.unit}</Text>
        </View>
      ))}
      <Text style={styles.label}>Categories:</Text>
      {product.categories.map(category => (
        <View key={category.id} style={styles.categoryContainer}>
          <Text>{category.title}</Text>
        </View>
      ))}
      <TouchableOpacity onPress={() => Linking.openURL(product.link)}>
        <Text style={styles.link}>More Info</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 16,
  },
  nutritionContainer: {
    marginBottom: 8,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default ProductDetailScreen;
