import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import PostLocation from "./src/PostLocation";
import { postLocation } from "./src/services/postLocation";
import * as BackgroundFetch from 'expo-background-fetch';
import LocationAtual from "./src/components/LocationAtual";

const LOCATION_TASK_NAME = "background-location-task";
const BACKGROUND_FETCH_TASK = 'background-fetch';

const requestPermissions = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status === "granted") {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
    });
  }
};

const requestPermissionsSegundoPlano = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === "granted") {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
    });
  }
};

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  setInterval(() => {
    if (error) {
      console.log('1º Plano (erro)');
      return;
    }
    if (data) {
      const { locations } = data;
      console.log('1º Plano (Sucesso)');
      postLocation(locations)
    }
  }, 5000);
});

TaskManager.defineTask(BACKGROUND_FETCH_TASK, ({ data, error }) => {
  console.log('2º Plano (Sem intervalo)');
  const { locations } = data;
  postLocation(locations)
  setInterval(() => {
    if (error) {
      console.log('2º Plano (erro)');
      return;
    }
    if (data) {
      const { locations } = data;
      console.log('2º Plano (Sucesso)');
      postLocation(locations)
      return BackgroundFetch.BackgroundFetchResult.NewData;
    }
  }, 2000);
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 20, // 15 minutes
    stopOnTerminate: true, // android only,
    startOnBoot: false, // android only
  });
}

async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

const PermissionsButton = () => {
  const [statusPrimeiroPlano, setStatusPrimeiro] = React.useState(false);
  const [statusSegundoPlano, setStatusSegundo] = React.useState(null);

  React.useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const statusPrimeiroPlano = await TaskManager.getTaskOptionsAsync(LOCATION_TASK_NAME);
    setStatusPrimeiro(statusPrimeiroPlano);
    const statusSegundoPlano = await BackgroundFetch.getStatusAsync();
    setStatusSegundo(statusSegundoPlano);
  };

  const iniciarLocalizaBackground = () => {
    requestPermissionsSegundoPlano();
    registerBackgroundFetchAsync()
  }

  return (
    <ScrollView >
      <View
        style={{
          flex: 1,
          height: '100%',
          alignItems: "center",
          justifyContent: "center",
          alignContent: 'center',
          marginTop: 20,
          backgroundColor: '#343A40'
        }}
      >
        <View style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 'auto'
        }}>
          <Image style={{ width: 200, height: 200 }} source={require('./assets/icon.png')} />
        </View>
        <View style={{ marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', backgroundColor: '#676767', padding: 8, borderRadius: 8 }}>
            <View style={{ backgroundColor: '#4ab959', width: 24, height: 24, borderRadius: 100, marginRight: 4 }}></View>
            <Text style={{ textAlign: 'center', color: '#fff' }} >{statusPrimeiroPlano ? 'Localização Primeiro Disponível' : 'Localização Primeiro indisponível'}</Text>
          </View>
        </View>
        <View style={{ marginBottom: 8 }}>
          {statusSegundoPlano === 3 ?
            <View style={{ flexDirection: 'row', backgroundColor: '#676767', padding: 8, borderRadius: 8 }}>
              <View style={{ backgroundColor: '#4ab959', width: 24, height: 24, borderRadius: 100, marginRight: 4 }}></View>
              <Text style={{ textAlign: 'center', color: '#fff' }} >{statusSegundoPlano === 3 ? 'Segundo Plano Disponível' : ''}</Text>
            </View>
            : ''
          }
          {statusSegundoPlano === 2 ?
            <View style={{ flexDirection: 'row', backgroundColor: '#676767', padding: 8, borderRadius: 8 }}>
              <View style={{ backgroundColor: '#c00', width: 24, height: 24, borderRadius: 100, marginRight: 4 }}></View>
              <Text style={{ textAlign: 'center' }} >{statusSegundoPlano === 2 ? 'Atualizações em segundo plano não estão disponíveis' : ''}</Text>
            </View>
            :
            ''
          }
          {statusSegundoPlano === 1 ?
            <View style={{ flexDirection: 'row', backgroundColor: '#676767', padding: 8, borderRadius: 8 }}>
              <View style={{ backgroundColor: '#000', width: 24, height: 24, borderRadius: 100, marginRight: 4 }}></View>
              <Text style={{ textAlign: 'center' }} >{statusSegundoPlano === 1 ? 'Desabilitado pelo usuário' : ''}</Text>
            </View>
            :
            ''
          }
        </View>

        <LocationAtual />

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
          <TouchableOpacity
            onPress={requestPermissions}
            style={{ marginTop: 12, width: 120, backgroundColor: '#244375', maxWidth: '100%', borderRadius: 12, padding: 8 }}
          >
            <View style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 'auto'
            }}>
              <Image style={{ width: 60, height: 60 }} source={require('./assets/location-normal.png')} />
              <Text style={{ color: '#fff', textAlign: 'center' }}> Localização Simples </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={iniciarLocalizaBackground}
            style={{ marginTop: 12, width: 120, backgroundColor: '#EB811F', maxWidth: '100%', borderRadius: 12, padding: 8 }}
          >
            <View style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: 'auto'
            }}>
              <Image style={{ width: 60, height: 60 }} source={require('./assets/location-precisa.png')} />
              <Text style={{ color: '#fff', textAlign: 'center' }}> Localização Precisa </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity onPress={unregisterBackgroundFetchAsync} style={{ marginTop: 32, backgroundColor: '#c00', maxWidth: '100%', borderRadius: 12, padding: 8 }}>
        <Text style={{ color: '#fff', textAlign: 'center' }}> Parar localização em 2º plano </Text>
      </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
};

export default PermissionsButton;