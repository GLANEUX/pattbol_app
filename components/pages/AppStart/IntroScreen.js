import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Swiper from 'react-native-swiper';

const IntroScreen = ({ navigation }) => {
  return (
    <Swiper
      style={styles.wrapper}
      loop={false}
      showsPagination={true}
      showsButtons={true}
      paginationStyle={styles.paginationStyle}
      buttonWrapperStyle={styles.buttonWrapperStyle}
      activeDotColor={'orange'}
      prevButton={<Text style={styles.arrow}>{'<'}</Text>}
      nextButton={<Text style={styles.arrow}>{'>'}</Text>}
      index={0}
    >
<View style={styles.slide}>
        <Text style={styles.title}>Titre de la Page 1</Text>
        <Text style={styles.text}>Description de la Page 1.</Text>

      

      </View>

      <View style={styles.slide}>
        <Text style={styles.title}>Titre de la Page 2</Text>
        <Text style={styles.text}>Description de la Page 2.</Text>

      
      </View>

      <View style={styles.slide}>
        <Text style={styles.title}>Titre de la Page 3</Text>
        <Text style={styles.text}>Description de la Page 3.</Text>
        <Button title="Accéder à la Connexion" onPress={() => navigation.navigate('SignIn')} />

      </View>
    </Swiper>
  );
};
  
const styles = StyleSheet.create({
 wrapper: {},
  paginationStyle: {
    backgroundColor: 'transparent',
  },
  buttonWrapperStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  arrow: {
    fontSize: 24,
    color: 'orange',
  },  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },

  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default IntroScreen;
