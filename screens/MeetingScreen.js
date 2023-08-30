import { View, Text, TextInput, ScrollView, FlatList } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native";
import NewestMeet from "../components/NewestMeet";

const MeetingScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={tw`mr-3`}
          onPress={() => {
            navigation.navigate("CreateMeeting");
          }}
        >
          <Ionicons name="add" size={35} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const dummyList = [
    { id: 1, component: <NewestMeet /> },
    { id: 2, component: <NewestMeet /> },
  ];

  return (
    <View>
      <View
        style={tw`flex-row py-3 px-4 self-center bg-[#fff] my-4 rounded-full items-center justify-center border-2 border-slate-700 mt-5`}
      >
        <AntDesign name="search1" size={20} style={tw`mr-2`} />
        <TextInput
          style={tw`w-1/2`}
          onChangeText={setSearchText}
          value={searchText}
          placeholder="Tìm tên sân/ chủ sân"
        />
      </View>

      <ScrollView style={tw`mx-auto`}>
        <NewestMeet />
        <NewestMeet style={tw`mb-10`} />
      </ScrollView>
    </View>
  );
};

export default MeetingScreen;
