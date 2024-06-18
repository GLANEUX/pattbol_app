import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import colors from '../../../assets/styles/colors';
import style from '../../../assets/styles/globalStyles'
const IntroScreen = ({ navigation }) => {
  return (
    <Swiper
      loop={false}
      showsPagination={true}
      showsButtons={true}
      paginationStyle={styles.paginationStyle}
      buttonWrapperStyle={styles.buttonWrapperStyle}
      activeDotColor={'orange'}
      prevButton={<Image source={require('../../../assets/img/icon/arrowleft.png')} style={styles.icon} />}
      nextButton={<Image source={require('../../../assets/img/icon/arrowright.png')} style={styles.icon} />}
      index={0}
    >
      <View style={styles.slide}>
        <Image source={require('../../../assets/img/logos/logo_Pattbol.png')} style={styles.logo} />
        <View style={styles.circle}>
          <Image source={require('../../../assets/img/dogs/dog1.png')} style={styles.dogImage} />
        </View>
        <Text style={styles.title}>Bienvenue !</Text>
        <Text style={styles.text}>Patt’Bol est une appli 100% indépendante qui vous aide à choisir les bons produits</Text>
      </View>

      <View style={styles.slide}>
        <Image source={require('../../../assets/img/logos/logo_Pattbol.png')} style={styles.logo} />
        <View style={styles.circle}>
          <Image source={require('../../../assets/img/dogs/dog2.png')} style={styles.dogImage} />
        </View>
        <Text style={styles.title}>Analyse des produits</Text>
        <Text style={styles.text}>Patt’Bol scanne vos produits et évalue leur impact sur la santé</Text>
      </View>

      <View style={styles.slide}>
        <Image source={require('../../../assets/img/logos/logo_Pattbol.png')} style={styles.logo} />
        <View style={styles.circle}>
          <Image source={require('../../../assets/img/dogs/dog3.png')} style={styles.dogImage} />
        </View>
        <Text style={styles.title}>Recommandations</Text>
        <Text style={styles.text}>Patt’Bol vous recommande de meilleures alternatives</Text>
        <TouchableOpacity style={style.button} onPress={() => navigation.navigate('Connexion')}>
        <Text style={style.buttonText}>COMMENCER</Text>
      </TouchableOpacity>
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  paginationStyle: {
    backgroundColor: 'transparent',
  },
  buttonWrapperStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    margin: 20,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    position: 'relative',
  },
  logo: {
    position: 'absolute',
    top: 20,
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100, 
  },
  dogImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'TTMilksScript',
    fontSize: 30,
    color: colors.darkgreen,
    marginTop: 50, 
    marginBottom:20
  }, 
  text: {
    ...style.text,

    marginBottom: 30
  },


});

export default IntroScreen;
