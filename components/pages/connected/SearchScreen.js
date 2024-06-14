import React, {  useState } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { AuthContext } from '../../hooks/AuthContext';
import LoadingIndicator from '../../common/LoadingIndicator';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { state } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async () => {
    setLoading(true);
    if(query < 2){
      Alert.alert('Error', 'Vous devez entrez plus de 2 caractère');
      setLoading(false);
      return;
    }

    try {


    if (!state.userToken) {
      return;
    }

   
      const response = await fetch(`https://api.pattbol.fr/products/search/${query}`, {
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
    } catch (error) {
      Alert.alert('Error', error.message || 'An error occurred. Please try again.');
    }  finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.brand}</Text>
      <Text>{item.quantity} {item.quantityUnit}</Text>
      <Text>Rate: {item.rate}</Text>
      <Text>{item.statut}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetailScreen', { productId: item.id })}>
        <Text style={styles.link}>More Info</Text>
      </TouchableOpacity>
      {item.picture && <Image source={{ uri: item.picture }} style={styles.image} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search products..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 8,
  },
});

export default SearchScreen;
