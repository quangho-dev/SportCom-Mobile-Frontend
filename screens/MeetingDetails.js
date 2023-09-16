import { View, Text, StyleSheet } from "react-native";
import React from "react";
import tw from "twrnc";

const MeetingDetails = ({ route }) => {
  const meetingDetails = route.params.meeting;
  console.log("meetingDetails:", meetingDetails);

  return (
    <View style={tw`p-3`}>
      <Text style={styles.title}>Video:</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontSize: "bold",
  },
});

export default MeetingDetails;
