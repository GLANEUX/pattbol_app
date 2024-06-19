// ./components/pages/connected/HomeScreen.js
import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Button, FlatList, Alert } from 'react-native';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import globalStyles from '../../../assets/styles/globalStyles';
import colors from '../../../assets/styles/colors';
import defaultImage from '../../../assets/img/dogs/dog2.png';



const HomeScreen = () => {
  const { state, authContext } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();



  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontFamily: 'RouterMedium',
        fontSize:30,
        color: colors.darkgreen
      },
      headerStyle: {
        backgroundColor: 'white', // Changer la couleur de fond du header
      },
    });
  }, [navigation]);




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
    <TouchableOpacity style={globalStyles.listContainer} onPress={() => navigation.navigate('ProductDetailScreen', { productId: item.product.id })}>
      <View style={globalStyles.listItem}>


      <Image
  source={item.product.picture ? { uri: item.product.picture } : defaultImage}
  style={globalStyles.imageItem}
/>


        <View style={globalStyles.detailsContainer}>
          <Text style={globalStyles.titleItem}>{item.product.title}</Text>
          <Text style={globalStyles.description}>{item.product.brand} - {item.product.quantity} {item.product.quantityUnit}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  
  

  return (
    <View style={globalStyles.container}>
      {history.length > 0 ? (
        <>
          <FlatList
            data={history}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            style={globalStyles.flatlist}
          />
        </>
      ) : (
        <View style={globalStyles.container}>
          <Image source={require('../../../assets/img/dogs/dog4.png')}/>

          <Text style={styles.title}>AUCUN PRODUIT</Text>
          <Text style={styles.text}>Scanner le code-barre d'un produit pour commencer</Text>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Recherche')}>
            <Text style={globalStyles.buttonText}>Scanner un produit</Text>
          </TouchableOpacity>

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

  text: {
    ...globalStyles.text,

    marginBottom: 20
  },
  button:{
    ...globalStyles.button,
    paddingHorizontal:50
    },   
    title:{
      fontSize: 30,
      fontFamily: 'RouterMedium',
      marginVertical:5
    },

   
});

export default HomeScreen;
