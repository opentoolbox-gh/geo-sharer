import {PermissionsAndroid} from 'react-native';

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.requestMultiple(
      [
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ],
      {
        title: 'Location permission for bluetooth scanning',
        message:
          'Grant location permission to allow the app to scan for Bluetooth devices',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission for bluetooth scanning granted');
    } else {
      console.log('Location permission for bluetooth scanning denied');
    }
  } catch (err) {
    console.warn(err);
  }
}
