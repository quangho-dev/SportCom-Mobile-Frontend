import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { ScrollView } from "react-native";
import transformLevelArray from "../utils/transformLevelArray";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import s from "../style";
import Spinner from "react-native-loading-spinner-overlay";

const MeetingDetails = ({ route }) => {
  const [isVideoPreloading, setIsVideoPreloading] = useState(false);

  const meeting = route.params.meeting;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.spinnerWrapper}>
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={isVideoPreloading && meeting.videoUrl}
          //Text with the Spinner
          textContent={"Đang tải..."}
          //Text style of the Spinner Text
          textStyle={styles.spinnerTextStyle}
          color={s.colors.primary}
        />
      </View>

      {meeting.videoUrl && (
        <View style={styles.videoWrapper}>
          <Video
            style={styles.video}
            source={{
              uri: meeting.videoUrl,
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay
            rate={1}
            volume={1}
            onLoadStart={() => setIsVideoPreloading(true)}
            onReadyForDisplay={() => setIsVideoPreloading(false)}
          />
        </View>
      )}

      <View style={styles.imageWrapper}>
        <Image source={{ uri: meeting.imageUrl }} style={styles.image} />
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Tên hội:</Text>
        <Text style={styles.content}>{meeting.teamName}</Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Tên sân:</Text>
        <Text style={styles.content}>{meeting.courseName}</Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Địa chỉ:</Text>
        <Text style={styles.content}>{meeting.address}</Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Số sân:</Text>
        <Text style={styles.content}>{meeting.courseNumbers}</Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Chi phí:</Text>
        <Text style={styles.content}>{meeting.fee}</Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Trình độ:</Text>
        <Text style={styles.content}>
          {transformLevelArray(meeting.levels)}
        </Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Giờ chơi:</Text>
        <Text style={styles.content}>{meeting.playingTime}</Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Tên chủ sân:</Text>
        <Text style={styles.content}>{meeting.host.username}</Text>
      </View>

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Số điện thoại:</Text>
        <Text style={styles.content}>{meeting.phoneNumber}</Text>
      </View>

      {meeting.zaloNumber && (
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Số Zalo:</Text>
          <Text style={styles.content}>{meeting.zaloNumber}</Text>
        </View>
      )}

      {meeting.description && (
        <View style={[styles.contentWrapper, { paddingBottom: 40 }]}>
          <Text style={styles.title}>Miêu tả:</Text>
          <Text style={styles.content}>{meeting.description}</Text>
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
});

export default MeetingDetails;
