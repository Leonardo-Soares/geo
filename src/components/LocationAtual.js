import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet, Button } from "react-native";

import * as Location from "expo-location";

export default function LocationAtual() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão para localização negada");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, [altitude, longitude, velocidade]);

  let locationCompleta = "Carregando..";
  let altitude = "Carregando..";
  let longitude = "Carregando..";
  let velocidade = "Carregando..";

  if (errorMsg) {
    locationCompleta = errorMsg;
    console.log(locationCompleta);
  } else if (location) {
    locationCompleta = JSON.stringify(location);
    altitude = JSON.stringify(location.coords.altitude);
    longitude = JSON.stringify(location.coords.longitude);
    velocidade = JSON.stringify(location.coords.speed);
    console.log(locationCompleta);
  }

  return (
    <View style={{ marginVertical: 24 }}>
      <Text style={{ color: '#fff' }}>Altitude: {altitude}</Text>
      <Text style={{ color: '#fff' }}>Longitude: {longitude}</Text>
      <Text style={{ color: '#fff' }}>Velocidade: {velocidade}</Text>
    </View>
  );
}
