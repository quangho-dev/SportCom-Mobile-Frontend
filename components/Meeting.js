import { View, Image, StyleSheet, Text, Button } from "react-native";
import React from "react";
import tw from "twrnc";
import { TouchableOpacity } from "react-native";
import transformLevelArray from "../utils/transformLevelArray";
import { Video, ResizeMode } from "expo-av";
import { useNavigation } from "@react-navigation/native";

const Meeting = ({ meeting }) => {
  const navigation = useNavigation();

  const handlePressMeeting = () => {
    navigation.navigate("MeetingDetails", {
      meetingId: meeting.id,
    });
  };

  return (
    <View>
      <TouchableOpacity
        style={[tw`flex w-full min-h-60`, styles.shadow]}
        onPress={handlePressMeeting}
      >
        <Image source={{ uri: meeting.imageUrl }} style={tw`w-full h-60`} />

        <View style={tw`bg-white p-4`}>
          <View style={tw`flex-row`}>
            <Text style={styles.title}>{meeting.title}</Text>
          </View>

          <View style={tw`flex-row`}>
            <Text style={tw`font-bold`}>Tên sân:&nbsp;</Text>
            <Text>{meeting.courseName}</Text>
          </View>

          <View style={tw`flex-row`}>
            <Text style={tw`font-bold`}>Thời gian:&nbsp;</Text>
            <Text>{meeting.playingTime}</Text>
          </View>

          <View style={tw`flex-row max-w-55`}>
            <Text style={tw`font-bold`}>Địa chỉ:&nbsp;</Text>
            <Text>{meeting.address}</Text>
          </View>

          <View style={tw`flex-row`}>
            <Text style={tw`font-bold`}>Tên CLB:&nbsp;</Text>
            <Text>{meeting.teamName}</Text>
          </View>

          {meeting.levels && (
            <View style={tw`flex-row`}>
              <Text style={tw`font-bold`}>Trình độ:&nbsp;</Text>
              <Text>{transformLevelArray(meeting.levels)}</Text>
            </View>
          )}

          <View style={tw`flex-row`}>
            <Text style={tw`font-bold`}>Phí:&nbsp;</Text>
            <Text>{meeting.fee}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  imageOverlay: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0.3,
    backgroundColor: "black",
    zIndex: 3,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  video: {
    flex: 1,
    width: "100%",
    alignSelf: "stretch",
    height: 230,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Meeting;
