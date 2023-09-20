import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeetingsBelongToUser } from "../features/meeting/meetingSlice";
import Meeting from "../components/Meeting";
import { FlatList } from "react-native";
import { StyleSheet } from "react-native";

const MeetingsBelongToUserScreen = () => {
  const { meetingsBelongToUser } = useSelector((store) => store.meeting);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMeetingsBelongToUser());
  }, [fetchMeetingsBelongToUser]);

  const renderItem = ({ index, item }) => {
    return <Meeting meeting={item} index={index} />;
  };

  return (
    <View>
      {meetingsBelongToUser.length > 0 ? (
        <FlatList
          data={meetingsBelongToUser}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <View style={styles.textWrapper}>
          <Text style={styles.text}>Không tìm thấy buổi chơi nào</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textWrapper: {
    alignItems: "center",
    marginTop: 8,
  },
  text: {
    fontSize: 17,
  },
});

export default MeetingsBelongToUserScreen;
