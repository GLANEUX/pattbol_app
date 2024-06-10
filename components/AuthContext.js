import React from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        console.error('Échec du chargement du jeton utilisateur', e);
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };
    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        try {
          const response = await fetch("https://api.pattbol.fr/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            const result = await response.json();
            await SecureStore.setItemAsync('userToken', result.token);
            dispatch({ type: 'SIGN_IN', token: result.token });
          } else {
            try {
              const errorResult = await response.json();
              Alert.alert('Échec de la connexion', errorResult.error);
            } catch {
              Alert.alert('Échec de la connexion', 'Une erreur s\'est produite. Veuillez réessayer.');
            }
          }
        } catch (error) {
          Alert.alert('Échec de la connexion', 'Une erreur s\'est produite. Veuillez réessayer.');
        }
      },
      signOut: async () => {
        await SecureStore.deleteItemAsync('userToken');
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (data) => {
        try {
          const response = await fetch("https://api.pattbol.fr/users/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (response.ok) {
            const result = await response.json();
            await SecureStore.setItemAsync('userToken', result.token);
            dispatch({ type: 'SIGN_IN', token: result.token });
          } else {
            try {
              const errorResult = await response.json();
              Alert.alert('Échec de l\'inscription', errorResult.error);
            } catch {
              Alert.alert('Échec de l\'inscription', 'Une erreur s\'est produite. Veuillez réessayer.');
            }
          }
        } catch (error) {
          Alert.alert('Échec de l\'inscription', 'Une erreur s\'est produite. Veuillez réessayer.');
        }
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={{ state, authContext }}>
      {children}
    </AuthContext.Provider>
  );
};
