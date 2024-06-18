import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './components/hooks/AuthContext';
import { ActivityIndicator, View, Image, Text } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SignInScreen from './components/pages/AppStart/SignInScreen';
import SignUpScreen from './components/pages/AppStart/SignUpScreen';
import IntroScreen from './components/pages/AppStart/IntroScreen';

import HomeScreen from './components/pages/connected/HomeScreen';
import AccountScreen from './components/pages/connected/AccountScreen';

import OfflineScreen from './components/pages/OfflineScreen';
import LoadingIndicator from './components/common/LoadingIndicator';

import EditUserScreen from './components/pages/connected/EditUserScreen';
import EditPasswordScreen from './components/pages/connected/EditPasswordScreen';

import SearchScreen from './components/pages/connected/SearchScreen';
import ProductDetailScreen from './components/pages/connected/ProductDetailScreen';
import ScannerScreen from './components/pages/connected/ScannerScreen';

import CategoryListScreen from './components/pages/connected/CategoryListScreen';
import CategoryProductsScreen from './components/pages/connected/CategoryProductsScreen';
import { useFonts } from './assets/styles/fonts';
import colors from './assets/styles/colors';


import homeIcon from './assets/img/icon/Tapbar/accueil.png';
import homeIconSelected from './assets/img/icon/Tapbar/accueilselect.png';
import searchIcon from './assets/img/icon/Tapbar/search.png';
import searchIconSelected from './assets/img/icon/Tapbar/searchselect.png';
import scannerIcon from './assets/img/icon/Tapbar/scan.png';
import scannerIconSelected from './assets/img/icon/Tapbar/scannselect.png';
import categoriesIcon from './assets/img/icon/Tapbar/category.png';
import categoriesIconSelected from './assets/img/icon/Tapbar/categoryselect.png';
import accountIcon from './assets/img/icon/Tapbar/account.png';
import accountIconSelected from './assets/img/icon/Tapbar/accountselect.png';

import globalStyles from './assets/styles/globalStyles';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (



    <Tab.Navigator
    screenOptions={{
      tabBarStyle: globalStyles.tabBarStyle,
      tabBarActiveTintColor: colors.orange,
      tabBarInactiveTintColor: colors.darkgrey,
      tabBarShowLabel: false,
    }}
  >
    <Tab.Screen
      name="Accueil"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Accueil',
        tabBarIcon: ({ focused }) => (
          <View style={globalStyles.tabBarItem}>
            <Image
              source={focused ? homeIconSelected : homeIcon}
              style={globalStyles.tabBarImage}
            />
            <Text style={focused ? globalStyles.tabBarLabelFocused : globalStyles.tabBarLabel}>
              Accueil
            </Text>
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Recherche"
      component={SearchScreen}
      options={{
        tabBarLabel: 'Recherche',
        tabBarIcon: ({ focused }) => (
          <View style={globalStyles.tabBarItem}>
            <Image
              source={focused ? searchIconSelected : searchIcon}
              style={globalStyles.tabBarImage}
            />
            <Text style={focused ? globalStyles.tabBarLabelFocused : globalStyles.tabBarLabel}>
              Recherche
            </Text>
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Scanner"
      component={ScannerScreen}
      options={{
        tabBarLabel: 'Scanner',
        tabBarIcon: ({ focused }) => (
          <View style={globalStyles.tabBarItem}>
            <Image
              source={focused ? scannerIconSelected : scannerIcon}
              style={globalStyles.tabBarImage}
            />
            <Text style={focused ? globalStyles.tabBarLabelFocused : globalStyles.tabBarLabel}>
              Scanner
            </Text>
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Catégories"
      component={CategoryListScreen}
      options={{
        tabBarLabel: 'Catégories',
        tabBarIcon: ({ focused }) => (
          <View style={globalStyles.tabBarItem}>
            <Image
              source={focused ? categoriesIconSelected : categoriesIcon}
              style={globalStyles.tabBarImage}
            />
            <Text style={focused ? globalStyles.tabBarLabelFocused : globalStyles.tabBarLabel}>
              Catégories
            </Text>
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Profil"
      component={AccountScreen}
      options={{
        tabBarLabel: 'Profil',
        tabBarIcon: ({ focused }) => (
          <View style={globalStyles.tabBarItem}>
            <Image
              source={focused ? accountIconSelected : accountIcon}
              style={globalStyles.tabBarImage}
            />
            <Text style={focused ? globalStyles.tabBarLabelFocused : globalStyles.tabBarLabel}>
            Profil
            </Text>
          </View>
        ),
      }}
    />
  </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { state } = useContext(AuthContext);

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {state.userToken == null ? (
        <>
          <Stack.Screen name="IntroScreen" component={IntroScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Connexion" component={SignInScreen} />
          <Stack.Screen name="Inscription" component={SignUpScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="EditUserScreen" component={EditUserScreen} options={{ title: 'Modifier l\'utilisateur' }} />
          <Stack.Screen name="EditPasswordScreen" component={EditPasswordScreen} options={{ title: 'Modifier le mot de passe' }} />
          <Stack.Screen name="Recherche" component={SearchScreen} />
          <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
          <Stack.Screen name="Catégories" component={CategoryListScreen} />
          <Stack.Screen name="CategoryProductsScreen" component={CategoryProductsScreen} />
          <Stack.Screen name="ScannerScreen" component={ScannerScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await useFonts();
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  useEffect(() => {
    const checkInternetConnectivity = async () => {
      const netInfoState = await NetInfo.fetch();
      setIsConnected(netInfoState.isConnected);
    };

    const unsubscribe = NetInfo.addEventListener(checkInternetConnectivity);

    checkInternetConnectivity();

    return () => unsubscribe();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true); // Début de l'actualisation
    const netInfoState = await NetInfo.fetch();
    setIsConnected(netInfoState.isConnected);
    setTimeout(() => {
      setIsRefreshing(false); // Fin de l'actualisation après un délai
    }, 2000); // Délai de 2 secondes
  };

  if (!fontsLoaded) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LoadingIndicator />
    </View>
  }

  if (isRefreshing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <AuthProvider>
      {isConnected ? (
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      ) : (
        <OfflineScreen onRefresh={handleRefresh} />
      )}
    </AuthProvider>
  );
};

export default App;
