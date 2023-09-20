import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { ScrollView } from "react-native";
import transformLevelArray from "../utils/transformLevelArray";
import { useState } from "react";
import s from "../style";
import Spinner from "react-native-loading-spinner-overlay";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import { BASE_URL } from "@env";
import axios from "axios";
import LoadingOverlay from "./ui/LoadingOverlay";
import { useCallback } from "react";

const MeetingDetails = ({ route, navigation }) => {
  const [isVideoPreloading, setIsVideoPreloading] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [isFetchingMeeting, setIsFetchingMeeting] = useState(false);

  const { user } = useSelector((store) => store.user);
  const { token } = useSelector((store) => store.auth);

  const meetingId = route.params.meetingId;

  const screenIsFocused = useIsFocused();

  const handlePressEdit = () => {
    navigation.navigate("EditMeeting", {
      meeting: meetingData,
    });
  };

  const fetchMeetingById = useCallback(async () => {
    setIsFetchingMeeting(true);

    try {
      const res = await axios.get(`${BASE_URL}/api/meeting/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMeetingData(res.data);
      setIsFetchingMeeting(false);
    } catch (error) {
      console.log("error:", error);
      setIsFetchingMeeting(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetingById();
  }, [screenIsFocused]);

  if (isFetchingMeeting) {
    return <LoadingOverlay message="Đang tải..." />;
  }

  return (
    <ScrollView style={styles.container}>
      {meetingData &&
        meetingData.host &&
        meetingData.host.email === user.email && (
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={handlePressEdit} style={[styles.button]}>
              <AntDesign name="edit" color="white" size={18} />
              <Text style={styles.buttonText}>Chỉnh sửa</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {}} style={[styles.button]}>
              <Ionicons name="push-outline" color="white" size={18} />
              <Text style={styles.buttonText}>Đẩy lên đầu</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {}} style={[styles.button]}>
              <AntDesign name="delete" color="white" size={18} />
              <Text style={styles.buttonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}

      <View style={styles.spinnerWrapper}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={isVideoPreloading && meetingData && meetingData.videoUrl}
          //Text with the Spinner
          textContent={"Đang tải..."}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
          color={s.colors.primary}
        />
      </View>

      {meetingData && meetingData.videoUrl && (
        <View style={styles.videoWrapper}>
          <Video
            style={styles.video}
            source={{
              uri: meetingData.videoUrl,
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay={screenIsFocused}
            rate={1}
            volume={1}
            onLoadStart={() => setIsVideoPreloading(true)}
            onReadyForDisplay={() => setIsVideoPreloading(false)}
          />
        </View>
      )}

      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: meetingData && meetingData.imageUrl }}
          style={styles.image}
        />
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Tựa đề:</Text>
        <Text style={styles.content}>{meetingData && meetingData.title}</Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Tên hội:</Text>
        <Text style={styles.content}>
          {meetingData && meetingData.teamName}
        </Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Tên sân:</Text>
        <Text style={styles.content}>
          {meetingData && meetingData.courseName}
        </Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Địa chỉ:</Text>
        <Text style={styles.content}>{meetingData && meetingData.address}</Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Số sân:</Text>
        <Text style={styles.content}>
          {meetingData && meetingData.courseNumbers}
        </Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Chi phí:</Text>
        <Text style={styles.content}>{meetingData && meetingData.fee}</Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Trình độ:</Text>
        <Text style={styles.content}>
          {meetingData && transformLevelArray(meetingData.levels)}
        </Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Giờ chơi:</Text>
        <Text style={styles.content}>
          {meetingData && meetingData.playingTime}
        </Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Tên chủ sân:</Text>
        <Text style={styles.content}>
          {meetingData && meetingData.host && meetingData.host.username}
        </Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Số điện thoại:</Text>
        <Text style={styles.content}>
          {meetingData && meetingData.phoneNumber}
        </Text>
      </View>

      {meetingData && meetingData.zaloNumber && (
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Số Zalo:</Text>
          <Text style={styles.content}>{meetingData.zaloNumber}</Text>
        </View>
      )}

      {meetingData && meetingData.description && (
        <View style={[styles.contentWrapper]}>
          <Text style={styles.title}>Miêu tả:</Text>
          <Text style={styles.content}>{meetingData.description}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {},
  content: {
    fontSize: 16,
  },
  image: {
    height: 250,
    width: "100%",
    resizeMode: "contain",
  },
  video: {
    width: 300,
    height: 220,
    width: "100%",
  },
  videoWrapper: {
    width: "100%",
    marginBottom: 10,
  },
  imageWrapper: {
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  contentWrapper: {
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  spinnerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 15,
  },
  button: {
    backgroundColor: s.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
    textTransform: "uppercase",
  },
});

export default MeetingDetails;
