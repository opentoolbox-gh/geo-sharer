/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Geolocation from '@react-native-community/geolocation';
import React, {useCallback, useEffect} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const INTERVAL = 5 * 1000;
const MAX_LOGS = 5;

interface LocationData {
  coords?: {
    longitude?: number;
    latitude?: number;
    accuracy?: number;
    speed?: number;
  };
  location?: string;
}

function App(): React.JSX.Element {
  // TODO: uncomment this if you're using the Geocoder API to get location details in human readable format
  // Geocoder.init('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'); // GOOGLE MAPS API KEY
  const isDarkMode = useColorScheme() === 'dark';
  const [locationData, setLocationData] = React.useState({} as LocationData);
  const [loading, setLoading] = React.useState(false);
  const [editingApi, setEditingApi] = React.useState(true);
  const [apiUrl, setApiUrl] = React.useState(
    '', // API ENDPOINT
  );
  const [logs, setLogs] = React.useState([] as string[]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    padding: 10,
  };

  const addToLogs = (log: string) => {
    // add to top and only keep the last MAX_LOGS logs
    setLogs(prev => [log, ...prev].slice(0, MAX_LOGS) as string[]);
  };

  const sendLocationData = async (url: string, body: any) => {
    console.log('Called sendLocationData');
    if (!isValidURL(url)) {
      ToastAndroid.show('Invalid API URL', ToastAndroid.SHORT);
      return;
    }

    console.log('Sending data to: ' + url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      addToLogs(response.status + ' - Success');
    } else {
      addToLogs(response.status + ' - Unsuccessful');
    }
  };

  const updateLocationData = useCallback(
    async (url: string, sendToApi: boolean, body: any) => {
      setLoading(true);
      Geolocation.getCurrentPosition(
        async info => {
          setLocationData(info as any);

          // TODO: uncomment this if you're using the Geocoder API to get location details in human readable format
          // Geolocation.getCurrentPosition(async currentInfo => {
          //   setLocationData(currentInfo as any);
          //   Geocoder.from(
          //     currentInfo.coords.latitude,
          //     currentInfo.coords.longitude,
          //   )
          //     .then((json: any) => {
          //       var addressComponent = json.results[0].formatted_address;
          //       setLocationData(prevState => ({
          //         ...prevState,
          //         location: addressComponent,
          //       }));
          //     })
          //     .catch((error: any) => console.error(error));
          // });

          setLoading(false);
          console.log('Location data updated', {sendToApi, apiUrl: !!url});
          if (sendToApi && isValidURL(url)) {
            sendLocationData(url, body);
          }
        },
        error => {
          console.error('Error getting location data', error);
          setLoading(false);
        },
        {enableHighAccuracy: true, maximumAge: 0},
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const isValidURL = (url: string) => {
    const reg = new RegExp('(http|https)://[^ "]+$');
    return reg.test(url);
  };

  useEffect(
    function setLocationUpdateInterval() {
      const interval = setInterval(() => {
        updateLocationData(
          editingApi ? '' : apiUrl,
          !editingApi && isValidURL(apiUrl),
          locationData,
        );
      }, INTERVAL);
      return () => clearInterval(interval);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editingApi, updateLocationData, locationData],
  );

  useEffect(
    function validateApiUrl() {
      if (!editingApi) {
        // check if the API URL is valid
        // if it is not, show an error message
        if (!isValidURL(apiUrl)) {
          ToastAndroid.show('Invalid API URL', ToastAndroid.SHORT);
          setEditingApi(true);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editingApi],
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Text style={styles.sectionTitle}>{loading ? 'Loading...' : 'Current info'}</Text>
        <View style={styles.line}>
          <Text style={styles.monospaceFont}>{'longitude'.padEnd(14, ' ')}</Text>
          <Text>{locationData.coords?.longitude ?? 'unknown'}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.monospaceFont}>{'latitude'.padEnd(14, ' ')}</Text>
          <Text>{locationData.coords?.latitude ?? 'unknown'}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.monospaceFont}>{'accuracy'.padEnd(14, ' ')}</Text>
          <Text>{locationData.coords?.accuracy ?? 'unknown'}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.monospaceFont}>{'speed'.padEnd(14, ' ')}</Text>
          <Text>{locationData.coords?.speed ?? 'unknown'}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.monospaceFont}>{'location'.padEnd(14, ' ')}</Text>
          <Text>{locationData.location ?? 'unknown'}</Text>
        </View>

        <View style={styles.shareSection}>
          <Text style={styles.sectionTitle}>API to share to:</Text>
          <TextInput
            placeholder="API URL"
            style={editingApi ? styles.apiInput : styles.apiInputDisabled}
            value={apiUrl}
            onChangeText={setApiUrl}
            editable={editingApi}
            inputMode="url"
          />
          <Button
            title={!editingApi ? 'Edit' : 'Confirm'}
            onPress={() => setEditingApi(!editingApi)}
          />
        </View>

        {/* API CALL LOGS */}
        <View style={styles.shareSection}>
          <Text style={styles.sectionTitle}>API Call Logs:</Text>
          {logs.map((log, index) => (
            <Text key={index}>{log}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {padding: 10},
  line: {flex: 1, flexDirection: 'row', gap: 10, alignItems: 'center'},
  monospaceFont: {fontFamily: 'monospace'},
  shareSection: {flex: 1, flexDirection: 'column', gap: 10, marginTop: 30},
  sectionTitle: {fontSize: 20},
  apiInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
  },
  apiInputDisabled: {
    height: 40,
    borderColor: 'transparent',
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
  },
});

export default App;
