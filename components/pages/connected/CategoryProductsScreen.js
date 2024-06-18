import React, {  useLayoutEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../../../assets/styles/globalStyles';
import colors from '../../../assets/styles/colors';
import defaultImage from '../../../assets/img/dogs/dog2.png';

const CategoryProductsScreen = ({ route }) => {
  const { category, products } = route.params;
  const navigation = useNavigation();


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


  const renderItem = ({ item }) => (
    <TouchableOpacity style={globalStyles.listContainer} onPress={() => navigation.navigate('ProductDetailScreen', { productId: item.id })}>
      <View style={globalStyles.listItem}>
      <Image
  source={item.picture ? { uri: item.picture } : defaultImage}
  style={globalStyles.imageItem}
/>
        <View style={globalStyles.detailsContainer}>
          <Text style={globalStyles.titleItem}>{item.title}</Text>
          <Text style={globalStyles.description}>{item.brand} - {item.quantity} {item.quantityUnit}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{category}</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={globalStyles.flatlist}

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
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 8,
  },
});

export default CategoryProductsScreen;
