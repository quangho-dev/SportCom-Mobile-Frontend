import { View, Image, StyleSheet, Text, Button } from "react-native";
import React from "react";
import tw from "twrnc";
import { TouchableOpacity } from "react-native";
import transformLevelArray from "../utils/transformLevelArray";
import { useNavigation } from "@react-navigation/native";

const HomeScreenMeetingCard = ({ meeting, index }) => {
  const navigation = useNavigation();

  const handlePressMeeting = () => {
    navigation.navigate("MeetingDetails", {
      meeting,
    });
  };

  const styles = StyleSheet.create({
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
    wrapper: {
      width: "100%",
    },
    container: {
      flex: 1,
      width: "100%",
      overflow: "hidden",
      marginRight: index === 0 ? 10 : 10,
      marginLeft: index === 0 ? 0 : 10,
      borderRadius: 7,
    },
    image: {
      width: "100%",
      height: 200,
    },
    imageWrapper: {
      width: "100%",
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.wrapper} onPress={handlePressMeeting}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: meeting.imageUrl }} style={styles.image} />
        </View>

        <View style={[tw`h-full bg-white p-2 w-full max-w-full`]}>
          <View style={tw`flex-row`}>
            <Text style={tw`font-bold`}>Tên sân:&nbsp;</Text>
            <Text>{meeting.courseName}</Text>
          </View>

          <View style={tw`flex-row`}>
            <Text style={tw`font-bold`}>Thời gian:&nbsp;</Text>
            <Text>{meeting.playingTime}</Text>
          </View>

          <View style={tw`flex-row w-full max-w-full`}>
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

export default HomeScreenMeetingCard;
