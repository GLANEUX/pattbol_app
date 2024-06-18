import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { AuthContext } from '../../hooks/AuthContext';

const ScannerScreen = ({ navigation }) => {
  // Camera permission hooks
  const { hasPermission: cameraHasPermission, requestPermission: requestCameraPermission } = useCameraPermission();

  // Get the camera device (back camera)
  const device = useCameraDevice('back');

  // State to control barcode scanning availability and result handling
  const [canScan, setCanScan] = useState(true);
  const [popupMessage, setPopupMessage] = useState(null);

  // Get the auth context to access the user token
  const { state } = useContext(AuthContext);

  // Use the code scanner hook to configure barcode scanning
  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13'],
    onCodeScanned: (codes) => {
      // Check if codes array is not empty and scanning is allowed
      if (codes.length > 0 && canScan) {
        const scannedCode = codes[0]?.value;
        handleBarcodeScan(scannedCode);
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

  // Function to handle barcode scan
  const handleBarcodeScan = async (scannedCode) => {
    try {
      // API endpoint URL
      const apiUrl = `https://api.pattbol.fr/products/scan/${scannedCode}`;

      // Fetch data from API
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `${state.userToken}`,
          'Content-Type': 'application/json',
        },
      });

      // Parse JSON response
      const data = await response.json();

      // Handle API response based on result
      if (data.result && data.result.id) {
        // Product found, navigate to product detail screen
        navigation.navigate('ProductDetailScreen', { productId: data.result.id });
      } else {
        // No product found message
        setPopupMessage('Aucun produit trouvé pour ce code barre.');
      }

      // Prevent multiple scans within 5 seconds
      setCanScan(false);
      setTimeout(() => {
        setCanScan(true);
        setPopupMessage(null); // Clear popup message after 5 seconds
      }, 5000); // 5000 milliseconds = 5 seconds

    } catch (error) {
      console.error('Error scanning barcode:', error);
      // Handle error
      Alert.alert('Erreur', 'Une erreur est survenue lors du scan du code-barres.');
    }
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
      {popupMessage && (
        <View style={styles.popup}>
          <Text>{popupMessage}</Text>
        </View>
      )}
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
  popup: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default ScannerScreen;
