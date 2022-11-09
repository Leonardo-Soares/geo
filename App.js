import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import PostLocation from "./src/PostLocation";
import { postLocation } from "./src/services/postLocation";

const LOCATION_TASK_NAME = "background-location-task";

const requestPermissions = async () => {
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
      // Error occurred - check `error.message` for more details.
      return;
    }
    if (data) {
      const { locations } = data;
      postLocation(locations)
      // do something with the locations captured in the background
    }
  }, 5000);
});

const PermissionsButton = () => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity onPress={requestPermissions}>
        <Text>Enable background location</Text>
      </TouchableOpacity>
      {/* <PostLocation /> */}
    </View>
  );
};

export default PermissionsButton;
