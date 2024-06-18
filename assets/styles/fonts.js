import * as Font from 'expo-font';

export const useFonts = async () => {
  await Font.loadAsync({
    'TTMilksScript': require('../fonts/TTMilksScript.ttf'),
    'RouterThin': require('../fonts/RouterThin.ttf'),
    'RouterExtralight': require('../fonts/RouterExtralight.ttf'),
    'RouterLight': require('../fonts/RouterLight.ttf'),
    'Router': require('../fonts/Router.ttf'),
    'RouterMedium': require('../fonts/RouterMedium.ttf'),
  });
};
