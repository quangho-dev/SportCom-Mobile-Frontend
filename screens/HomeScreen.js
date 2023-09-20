import { View, Text, Button, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@env";
import { useLayoutEffect } from "react";
import HomeScreenHeaderTitle from "../components/HomeScreenHeaderTitle";
import { useState } from "react";
import tw from "twrnc";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { logout } from "../features/auth/authSlice";
import { useCallback } from "react";
import { FlatList } from "react-native";
import HomeScreenMeetingCard from "../components/HomeScreenMeetingCard";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Alert } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { setMeetings } from "../features/meeting/meetingSlice";

const HomeScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useSelector((store) => store.auth);
  const { meetings } = useSelector((store) => store.meeting);

  const navigation = useNavigation();

const isScreenFocused = useIsFocused()

  const dispatch = useDispatch();

  const showLogoutDialog = () => {
    return Alert.alert("Bạn có chắc là muốn thoát không?", null, [
      {
        text: "Không",
      },
      {
        text: "Có",
        onPress: () => {
          dispatch(logout());
        },
      },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HomeScreenHeaderTitle
          navigation={navigation}
          currentUserProfile={currentUserProfile}
        />
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            showLogoutDialog();
          }}
        >
          <AntDesign
            name="logout"
            size={30}
            color="#666"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, currentUser, currentUserProfile]);

  const handlePressFindMeetings = () => {
    navigation.navigate("SearchMeetingsHome");
  };

  const fetchMeetings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/meeting/latest-meetings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setMeetings(res.data));

      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [isScreenFocused]);

  const renderItem = ({ index, item }) => {
    return <HomeScreenMeetingCard meeting={item} index={index} />;
  };

  return (
    <ScrollView style={tw`px-4 flex-1`}>
      <View
        style={[
          tw`flex-row items-center content-center mx-auto bg-white rounded-3xl py-3 px-3 mt-4`,
          styles.shadow,
        ]}
      >
        <TouchableOpacity onPress={handlePressFindMeetings}>
          <View style={tw`flex-row`}>
            <Feather
              name="search"
              size={20}
              color="black"
              style={{ marginRight: 3 }}
            />
            <Text>Tìm buổi chơi</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={tw`mt-4`}>
        <Text style={tw`mb-2 text-5`}>Các buổi chơi mới nhất:</Text>

        {meetings.length > 0 ? (
          <FlatList
            data={meetings}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  verticleLine: {
    height: "120%",
    width: 1,
    backgroundColor: "black",
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
});

export default HomeScreen;
