import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';
import globalStyles from '../../../assets/styles/globalStyles';
import colors from '../../../assets/styles/colors';
import defaultImage from '../../../assets/img/dogs/dog2.png';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { state } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [initialSearch, setInitialSearch] = useState(true);
  const [introuvable, setIntrouvable] = useState(false);
  const navigation = useNavigation();
  const searchInputRef = useRef(null); // Référence pour l'input de recherche


  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: {
        fontFamily: 'RouterMedium',
        fontSize: 30,
        color: colors.darkgreen,
      },
      headerStyle: {
        backgroundColor: 'white',
      },
    });
  }, [navigation]);

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery); 

    if (!searchQuery.trim()) {
      setResults([]);
      setInitialSearch(true);
      return;
    }

    setLoading(true);
    setInitialSearch(false);
    try {
      if (!state.userToken) {
        return;
      }

      const response = await fetch(`https://api.pattbol.fr/products/search/${searchQuery}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${state.userToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch search results');
      }

      const searchData = await response.json();
      setResults(searchData.searchResult);
      setIntrouvable(false);

    } catch (error) {
      setResults([]);
      setIntrouvable(true);
    } finally {
      setLoading(false);
    }
  };

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
      <View style={styles.searchBarContainer}>
        <SearchBar
          ref={searchInputRef} // Attacher la référence à l'input de recherche
          placeholder="Rechercher..."
          lightTheme
          autoCorrect={false}
          onChangeText={handleSearch}
          value={query}
          showLoading={loading}
          platform="android"
          containerStyle={{
            backgroundColor: 'transparent',
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
            padding: 0,
            margin: 10,
          }}
          inputContainerStyle={{
            backgroundColor: colors.lightgrey,
            borderBottomColor: 'transparent',
            borderTopColor: 'transparent',
            paddingVertical: 0,
            borderRadius: 10,
            elevation: 3
          }}
          inputStyle={{
            color: colors.darkgrey,
            fontFamily: 'RouterMedium'
          }}
          cancelButtonStyle={{
            width: 50,
          }}
          loadingProps={{ color: colors.orange }}
          cancelButtonColor={colors.darkgrey}
          clearIcon={{ color: colors.darkgrey }}
        />
      </View>

      {query.trim() !== '' && !loading && (
        <>
          {results.length === 0 && !initialSearch && (
            <View style={styles.noResults}>
              <Image source={require('../../../assets/img/dogs/dog4.png')} />
              <Text style={styles.title}>AUCUN PRODUIT</Text>
              <Text style={styles.text}>Réessayer ou tentez de scanner un produit</Text>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Recherche')}>
                <Text style={globalStyles.buttonText}>Scanner un produit</Text>
              </TouchableOpacity>
            </View>
          )}

          {results.length !== 0 && !initialSearch && (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              style={globalStyles.flatlist}
            />
          )}
        </>
      )}

      {initialSearch && (
        <View style={styles.initialContainer}>
          <View style={styles.initialBox}>
            <Text style={styles.initialTitle}>RECHERCHE</Text>
            <Text style={styles.initialSubtitle}>Recherchez n'importe quel produit</Text>
            <Text style={globalStyles.text}>Plus de 5 000 produits alimentaires & accessoires pour animaux disponibles.</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scanner')}>
              <Text style={globalStyles.buttonText}>SCANNEZ ICI</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: 'flex-start', // Aligner le contenu en haut
    paddingHorizontal: 16,
  },
  searchBarContainer: {
    alignSelf: 'stretch', // S'étend sur toute la largeur
    marginTop: 10,
    marginBottom: 10,
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialBox: {
    backgroundColor: colors.lightgrey,
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  initialTitle: {
    fontFamily: 'RouterMedium',
    fontSize: 13,
    color: colors.orange,
    marginBottom: 10,
  },
  initialSubtitle: {
    fontFamily: 'RouterMedium',
    textAlign: 'center',
    fontSize: 25,
    marginBottom: 10,
  },
  text: {
    ...globalStyles.text,
    marginBottom: 20,
  },
  button: {
    ...globalStyles.button,
    marginTop: 15,
    paddingVertical: 7,
  },
  noResults: {
    alignSelf: 'stretch', // S'étend sur toute la largeur

    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontFamily: 'RouterMedium',
    marginBottom: 5,
    marginTop: 30,
  },
});

export default SearchScreen;
