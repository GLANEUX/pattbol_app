// ./fonts.js
import * as Font from 'expo-font';

export const useFonts = async () => {
  await Font.loadAsync({
    'TT Milks Script': require('./assets/fonts/TT Milks Script.ttf'),
    'Router Thin': require('./assets/fonts/Router Thin.ttf'),
    'Router Extralight': require('./assets/fonts/Router Extralight.ttf'),
    'Router Light': require('./assets/fonts/Router Light.ttf'),
    'Router': require('./assets/fonts/Router.ttf'),
    'Router Medium': require('./assets/fonts/Router Medium.ttf'),
  });
};
