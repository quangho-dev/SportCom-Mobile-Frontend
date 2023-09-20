import { View, Image, StyleSheet, Text, Button } from "react-native";
import React from "react";
import tw from "twrnc";
import { TouchableOpacity } from "react-native";
import transformLevelArray from "../utils/transformLevelArray";
import { Video, ResizeMode } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import s from "../style";

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

          <View style={tw`flex-row max-w-70`}>
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

          {meeting.isFull ? (
            <View style={styles.isFullIconWrapper}>
              <AntDesign
                name="checkcircleo"
                size={22}
                color="#0d6efd"
                style={tw`mr-1`}
              />
              <Text style={styles.isFullText}>Đã đủ người</Text>
            </View>
          ) : (
            <View style={styles.isFullIconWrapper}>
              <Feather
                name="alert-triangle"
                size={22}
                color={s.colors.primary}
                style={tw`mr-1`}
              />
              <Text style={styles.isNotFullText}>Còn tuyển</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.bottomLine}></View>
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
  isFullIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  isFullText: {
    color: "#0d6efd",
    fontSize: 16,
  },
  isNotFullText: {
    color: s.colors.primary,
    fontSize: 16,
  },
  bottomLine: {
    height: 17,
    width: "100%",
    backgroundColor: "#b3b3b3",
  },
});

export default Meeting;
