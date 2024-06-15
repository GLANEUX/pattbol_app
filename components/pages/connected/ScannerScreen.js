import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';

const ScannerScreen = ({ navigation }) => {
  // Camera permission hooks
  const { hasPermission: cameraHasPermission, requestPermission: requestCameraPermission } = useCameraPermission();

  // Get the camera device (back camera)
  const device = useCameraDevice('back');

  // State to control barcode scanning availability
  const [canScan, setCanScan] = useState(true);

  // Use the code scanner hook to configure barcode scanning
  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13'],
    onCodeScanned: (codes) => {
      // Check if codes array is not empty and scanning is allowed
      if (codes.length > 0 && canScan) {
        const scannedCode = codes[0]?.value;
        showAlert(scannedCode);

        // Prevent multiple scans within 5 seconds
        setCanScan(false);
        setTimeout(() => {
          setCanScan(true);
        }, 3000); // 5000 milliseconds = 5 seconds
      }
    },
  });

  // Handle camera permission on component mount
  useEffect(() => {
    handleCameraPermission();
  }, []);

  // Handle camera permission
  const handleCameraPermission = async () => {
    const granted = await requestCameraPermission();

    if (!granted) {
      alert(
        'Camera permission is required to use the camera. Please grant permission in your device settings.'
      );
    }
  };

  // Show alert with barcode value
  const showAlert = (value) => {
    Alert.alert(
      'Code-barres détecté',
      `Code: ${value}`,
      [
        {
          text: 'OK',
          onPress: () => {}, // Optionally, you can handle onPress event
        },
      ],
      { cancelable: false }
    );
  };

  // Render content based on camera device availability
  if (device == null)
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera Not Found</Text>
      </View>
    );

  // Return the main component structure
  return (
    <SafeAreaView style={styles.container}>
      <Camera
        codeScanner={codeScanner}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
    </SafeAreaView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ScannerScreen;
