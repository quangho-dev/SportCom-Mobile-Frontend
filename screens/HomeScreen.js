import { View, Text, Button, TouchableOpacity, ScrollView } from "react-native";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../store/auth-context";
import axios from "axios";
import { BASE_URL } from "@env";
import { useLayoutEffect } from "react";
import HomeScreenHeaderTitle from "../components/HomeScreenHeaderTitle";
import { useState } from "react";
import tw from "twrnc";
import { StyleSheet } from "react-native";
import NewestMeet from "../components/NewestMeet";
import NewestTeam from "../components/NewestTeam";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../features/auth/authSlice";

const HomeScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  const navigation = useNavigation();

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HomeScreenHeaderTitle
          navigation={navigation}
          currentUserProfile={currentUserProfile}
        />
      ),
      headerRight: () => (
        <View>
          <Button
            title="Out"
            onPress={() => {
              dispatch(logout());
            }}
          />
        </View>
      ),
    });
  }, [navigation, currentUser, currentUserProfile]);

  return (
    <ScrollView style={tw`px-4 flex-1`}>
      <View
        style={[
          tw`flex-row items-center content-center mx-auto bg-white rounded-3xl py-3 px-3 mt-4`,
          styles.shadow,
        ]}
      >
        <TouchableOpacity style={tw`mr-2`}>
          <Text>Tìm buổi chơi</Text>
        </TouchableOpacity>

        <View style={styles.verticleLine}></View>

        <TouchableOpacity style={tw`ml-2`}>
          <Text>Tìm câu lạc bộ</Text>
        </TouchableOpacity>
      </View>

      <View style={tw`mt-4`}>
        <Text style={tw`font-bold mb-2`}>Các buổi chơi mới nhất:</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <NewestMeet />
          <NewestMeet />
        </ScrollView>
      </View>

      <View style={tw`mt-4 pb-6`}>
        <Text style={tw`font-bold mb-2`}>Các câu lạc bộ mới nhất:</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <NewestTeam />
          <NewestTeam />
        </ScrollView>
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
