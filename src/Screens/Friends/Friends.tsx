import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Layout } from "@/ui-components";

const data = ["Amit", "Tanmoy", "Shreya", "Shibu", "Saurabh", "Arpit"];

const Friends = () => {
  return (
    <Layout>
      <View>
        <Text>Friends</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  borderColor: "red",
                  borderWidth: 1,
                  borderRadius: 16,
                  paddingVertical: 40,
                  marginBottom: 40,
                }}
              >
                <Text>{item}</Text>
              </View>
            );
          }}
        />
      </View>
    </Layout>
  );
};

export default Friends;
