import { View, Image, StyleSheet, Text, Button } from "react-native";
import React from "react";
import tw from "twrnc";
import { TouchableOpacity } from "react-native";
import transformLevelArray from "../utils/transformLevelArray";
import { Video, ResizeMode } from "expo-av";

const Meeting = ({ meeting }) => {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  return (
    <View>
      {meeting.videoUrl ? (
        <>
          <Video
            ref={video}
            style={styles.video}
            source={{
              uri: meeting.videoUrl,
            }}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            isLooping
            rate={1.0}
            volume={1.0}
            isMuted={false}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />

          <Button
            title={status.isPlaying ? "Pause" : "Play"}
            onPress={() =>
              status.isPlaying
                ? video.current.pauseAsync()
                : video.current.playAsync()
            }
          />

          <TouchableOpacity style={[tw`flex w-full min-h-60`, styles.shadow]}>
            <View style={tw`h-40 bg-white p-4`}>
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

              <View style={tw`flex-row`}>
                <Text style={tw`font-bold`}>Trình độ:&nbsp;</Text>
                <Text>{transformLevelArray(meeting.levels)}</Text>
              </View>

              <View style={tw`flex-row`}>
                <Text style={tw`font-bold`}>Phí:&nbsp;</Text>
                <Text>{meeting.fee}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={[tw`flex w-full min-h-60`, styles.shadow]}>
          <Image source={{ uri: meeting.imageUrl }} style={tw`w-full h-60`} />
          <View style={tw`h-40 bg-white p-4`}>
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

            <View style={tw`flex-row`}>
              <Text style={tw`font-bold`}>Trình độ:&nbsp;</Text>
              <Text>{transformLevelArray(meeting.levels)}</Text>
            </View>

            <View style={tw`flex-row`}>
              <Text style={tw`font-bold`}>Phí:&nbsp;</Text>
              <Text>{meeting.fee}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
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
});

export default Meeting;
