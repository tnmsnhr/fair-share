import { Platform } from "react-native";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";
import * as ExpoContacts from "expo-contacts";

export const requestContactPermission = async () => {
  const permission =
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.CONTACTS
      : PERMISSIONS.ANDROID.READ_CONTACTS;

  const { status } = await ExpoContacts.requestPermissionsAsync();
  return status === ExpoContacts.PermissionStatus.GRANTED;
};
