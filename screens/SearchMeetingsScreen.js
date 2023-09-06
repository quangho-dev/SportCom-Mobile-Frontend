import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "@env";
import filter from "lodash.filter";
import { FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native";
import s from "../style";
import Meeting from "../components/Meeting";

const SearchMeetingsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fullMeetings, setFullMeetings] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useSelector((store) => store.auth);

  useEffect(() => {
    fetchMeetings();
  }, [searchQuery]);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get(`${BASE_URL}/api/meeting/latest-meetings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMeetings(res.data);

      setFullMeetings(res.data);

      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formattedQuery = searchQuery.toLowerCase();
    const filteredMeetings = filter(fullMeetings, (meeting) => {
      return contains(meeting, formattedQuery);
    });

    setMeetings(filteredMeetings);
  };

  const contains = ({ courseName, teamName, address }, query) => {
    const formattedCourseName = courseName.toLowerCase();
    const formattedTeamName = teamName.toLowerCase();
    const formattedAddress = address.toLowerCase();

    if (formattedCourseName.includes(query)) {
      return true;
    }

    return false;
  };

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={tw`text-base`}>
          Đã xảy ra lỗi trong lúc lấy dữ liệu. Vui lòng kiểm tra internet của
          bạn.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color={s.colors.primary} />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    return <Meeting meeting={item} />;
  };

  return (
    <>
      <View
        style={tw`flex-row mx-auto w-6/7 my-4 rounded-full items-center justify-between border-solid border-2 border-[#F86F03] p-1 bg-[#fff]`}
      >
        <TextInput
          onChangeText={(query) => handleSearch(query)}
          value={searchQuery}
          placeholder="Tìm bằng tên sân/ địa chỉ/ tên hội"
          clearButtonMode="always"
          autoCorrect={false}
          autoCapitalize="none"
          style={tw`ml-2 bg-[#fff] rounded-l-full h-10`}
        />

        <View style={tw`bg-[#F86F03] p-3 rounded-full`}>
          <AntDesign name="search1" size={20} color="white" />
        </View>
      </View>
      <View style={tw`mx-auto`}>
        <FlatList
          data={meetings}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  loaderStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchMeetingsScreen;
