// import Contacts, { Contact } from "react-native-contacts";
import * as ExpoContacts from "expo-contacts";

export const getAllContacts = async (): Promise<ExpoContacts.Contact[]> => {
  const { data } = await ExpoContacts.getContactsAsync({
    fields: [ExpoContacts.Fields.PhoneNumbers],
    sort: ExpoContacts.SortTypes.FirstName,
  });
  return data;
};

export const searchContacts = async (
  query: string
): Promise<ExpoContacts.Contact[]> => {
  if (!query?.trim()) return getAllContacts();
  const { data } = await ExpoContacts.getContactsAsync({
    name: query.trim(),
    fields: [ExpoContacts.Fields.PhoneNumbers],
  });
  return data;
};
