import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './components/hooks/AuthContext';
import SignInScreen from './components/pages/auth/SignInScreen';
import SignUpScreen from './components/pages/auth/SignUpScreen';
import HomeScreen from './components/pages/connected/HomeScreen';
import AccountScreen from './components/pages/connected/AccountScreen';
import OfflineScreen from './components/pages/OfflineScreen';
import { ActivityIndicator, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useFonts } from './fonts'; // Importer la fonction de chargement des polices
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { state } = useContext(AuthContext);

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {state.userToken == null ? (
        <>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  const [isConnected, setIsConnected] = useState(true);
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
    const netInfoState = await NetInfo.fetch();
    setIsConnected(netInfoState.isConnected);
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
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
