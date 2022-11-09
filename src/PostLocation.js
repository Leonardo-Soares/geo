import React, { useState, useEffect } from "react";
import { Platform, Text, View, StyleSheet, Button } from "react-native";

import * as Location from "expo-location";

export default function PostLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";

  if (errorMsg) {
    text = errorMsg;
    console.log(text);
  } else if (location) {
    text = JSON.stringify(location);
    console.log(text);
  }

  async function postLocation(location) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      location: location,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      "https://api-temp.vercel.app/api/ifred-location/delivery-location",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  function sendLocation() {
    setInterval(() => {
      if (errorMsg) {
        text = errorMsg;
        console.log(text);
      } else if (location) {
        text = JSON.stringify(location);
        console.log(text);
        postLocation(text);
      }
    }, 5000);
  }

  return (
    <View>
      <Text>{text}</Text>
      <Button title="Send Location" onPress={sendLocation} />
    </View>
  );
}
