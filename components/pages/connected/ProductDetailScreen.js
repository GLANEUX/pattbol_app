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
        setProduct(productData.product);
      } catch (error) {
        Alert.alert('Erreur', error.message || 'Une erreur s\'est produite. Veuillez réessayer.');
      }
    };

    fetchProductDetails();
  }, [productId, state.userToken]);

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
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
      data: [
        {
          key: 'details',
          render: () => (
            <View style={styles.productContainer}>
              <Image
                source={product.picture ? { uri: product.picture } : defaultImage}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <Text style={styles.productDescription}>{product.brand} - {product.quantity} {product.quantityUnit}</Text>
              </View>
              <Image source={rateImages[product.rate - 1]} style={styles.rateImage} />
            </View>
          )
        }
      ]
    },
    {
      title: 'Informations nutritionnelles',
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
      title: 'Détails supplémentaires',
      data: [
        { label: 'Code-barres', value: product.barCode },
        { label: 'Conditionnement', value: product.conditioning },
        { label: 'Liste des ingrédients', value: product.ingredientsList },
        { label: 'Vitamines ajoutées', value: product.addedVitamins },
        { label: 'Minéraux ajoutés', value: product.addedMinerals },
      ].filter(item => item.value).map((item, index) => ({
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },


  productContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: colors.lightgrey,
    borderRadius: 10,
    padding: 16,
    paddingBottom: 0,
    elevation: 2,
  },
  productImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 12,
  },

  productTitle: {
    fontSize: 25,
    textAlign: "center",
    color: colors.darkgreen,
    marginBottom: 4,
    fontFamily: "TTMilksScript"
  },
  productDescription: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    fontFamily: "Router"

  },
  rateImage: {
    width: 200,
    resizeMode: 'contain',
  },
  nutritionContainer: {
    marginBottom: 8,
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
  },
  nutritionLabel: {
    fontSize: 16,
    color: colors.darkgrey,
    fontFamily: "Router"

  },
  detailItem: {
    marginBottom: 8,
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    fontFamily: "Router"

  },
  label: {
    fontSize: 16,
    color: colors.darkgrey,
    fontFamily: "Router"

  },

});

export default ProductDetailScreen;
