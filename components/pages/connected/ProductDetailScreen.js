import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, Linking, SectionList } from 'react-native';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../../assets/styles/globalStyles';
import colors from '../../../assets/styles/colors';
import LoadingIndicator from '../../common/LoadingIndicator';
import defaultImage from '../../../assets/img/dogs/dog2.png';

const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;
  const { state } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
      headerLeft: () => (
        <Text onPress={() => navigation.goBack()} style={globalStyles.cancelText}>Annuler</Text>
      ),
      headerTitle: '', // Supprime le titre
      headerTitleStyle: {
        fontFamily: 'RouterMedium',
        color: colors.darkgreen
      },
      headerStyle: {
        backgroundColor: 'white', // Changer la couleur de fond du header
      },
    });
  }, [navigation]);

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingIndicator />
      </View>
    );
  }

  const rateImages = [
    require('../../../assets/img/nutriscore/nutri1.png'),
    require('../../../assets/img/nutriscore/nutri2.png'),
    require('../../../assets/img/nutriscore/nutri3.png'),
    require('../../../assets/img/nutriscore/nutri4.png'),
    require('../../../assets/img/nutriscore/nutri5.png'),
  ];

  const sections = [
    {
      title: 'Product Details',
      data: [
        {
          key: 'details',
          render: () => (
            <View style={globalStyles.listContainer}>
              <View style={globalStyles.listItem}>
                <Image
                  source={product.picture ? { uri: product.picture } : defaultImage}
                  style={globalStyles.imageItem}
                />
                <View style={globalStyles.detailsContainer}>
                  <Text style={globalStyles.titleItem}>{product.title}</Text>
                  <Text style={globalStyles.description}>{product.brand} - {product.quantity} {product.quantityUnit}</Text>
                  <Image source={rateImages[product.rate - 1]} style={styles.rateImage} />
                </View>
              </View>
            </View>
          )
        }
      ]
    },
    {
      title: 'Nutritional Information',
      data: product.nutricionalInformations.map(info => ({
        key: info.id.toString(),
        render: () => (
          <View style={styles.nutritionContainer}>
            <Text style={styles.nutritionLabel}>{info.name}: {info.value} {info.unit}</Text>
          </View>
        )
      }))
    },
    {
      title: 'Additional Details',
      data: [
        { label: 'Bar Code', value: product.barCode },
        { label: 'Conditioning', value: product.conditioning },
        { label: 'Ingredients List', value: product.ingredientsList },
        { label: 'Added Vitamins', value: product.addedVitamins },
        { label: 'Added Minerals', value: product.addedMinerals },
      ].map((item, index) => ({
        key: index.toString(),
        render: () => (
          <View style={styles.detailItem}>
            <Text style={styles.label}>{item.label}: {item.value}</Text>
          </View>
        )
      }))
    }
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item, index) => item.key}
      renderItem={({ item }) => item.render()}
      renderSectionHeader={({ section: { title } }) => (
        <View style={styles.section}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      ListFooterComponent={() => (
        <TouchableOpacity onPress={() => Linking.openURL(product.link)}>
          <Text style={[styles.link, { alignSelf: 'center' }]}>More Info</Text>
        </TouchableOpacity>
      )}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.darkgreen,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rateImage: {
    width: 300,
    marginLeft: 8,
    resizeMode: 'contain',
  },
  nutritionContainer: {
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
    marginTop: 8,
  },
  detailItem: {
    marginBottom: 8,
  },
});

export default ProductDetailScreen;
