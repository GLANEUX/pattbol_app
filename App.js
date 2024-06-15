import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './components/hooks/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

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


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Category" component={CategoryListScreen} />
      <Tab.Screen name="Scanner" component={ScannerScreen} />
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
              <Stack.Screen name="IntroScreen" component={IntroScreen}   options={{ headerShown: false }} />

          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        <>
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="EditUserScreen" component={EditUserScreen} options={{ title: 'Modifier l\'utilisateur' }} />
        <Stack.Screen name="EditPasswordScreen" component={EditPasswordScreen} options={{ title: 'Modifier le mot de passe' }} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ title: 'Search Products' }} /> 
        <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
        <Stack.Screen name="CategoryListScreen" component={CategoryListScreen} />
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
