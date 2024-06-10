// ./App.js
import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, AuthContext } from './components/AuthContext';
import SignInScreen from './components/pages/SignInScreen';
import SignUpScreen from './components/pages/SignUpScreen';
import HomeScreen from './components/pages/HomeScreen';
import OfflineScreen from './components/pages/OfflineScreen';
import { ActivityIndicator, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const Stack = createStackNavigator();

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
        <Stack.Screen name="Home" component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  const [isConnected, setIsConnected] = useState(true);

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
