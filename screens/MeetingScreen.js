import { View, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import axios from "axios";
import { BASE_URL } from "@env";
import Meeting from "../components/Meeting";
import { useSelector } from "react-redux";
import { ActivityIndicator } from "react-native";
import s from "../style";

const MeetingScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [currentSkip, setCurrentSkip] = useState(0);
  const [take, setTake] = useState(5);
  const [meetings, setMeetings] = useState([]);

  const { token } = useSelector((store) => store.auth);

  useEffect(() => {
    getMeetings();
  }, [currentSkip]);

  const getMeetings = async () => {
    setIsLoading(true);
    const res = await axios.get(
      `${BASE_URL}/api/meeting/pagination?skip=${currentSkip}&take=${take}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMeetings([...meetings, ...res.data]);
    setIsLoading(false);
  };

  const renderItem = ({ item }) => {
    return <Meeting meeting={item} />;
  };

  const renderLoader = () => {
    return isLoading ? (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color={s.colors.primary} />
      </View>
    ) : null;
  };

  const loadMoreItem = () => {
    setCurrentSkip(currentSkip + 5);
  };

  return (
    <View>
      <View style={tw`mx-auto`}>
        <FlatList
          data={meetings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderLoader}
          onEndReached={loadMoreItem}
          onEndReachedThreshold={0}
          contentContainerStyle={{ paddingBottom: 200 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderStyle: {
    marginVertical: 16,
    alignItems: "center",
    marginBottom: 100,
  },
});

export default MeetingScreen;
