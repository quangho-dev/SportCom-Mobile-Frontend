import { View, Image, StyleSheet, Text, ScrollView } from "react-native";
import React from "react";
import tw from "twrnc";
import s from "../style";
import { format } from "date-fns";
import displayLevel from "../utils/displayLevel";
import { useLayoutEffect } from "react";
import { TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const UserProfileScreen = ({ navigation, route }) => {
  const { currentUser, currentUserProfile } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Thông tin người dùng",
      headerStyle: {
        backgroundColor: s.colors.primary,
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity
          style={tw`flex-row items-center content-center`}
          onPress={() => {
            navigation.navigate("EditUserProfile", {
              currentUser,
              currentUserProfile,
            });
          }}
        >
          <FontAwesome5 name="user-edit" color="#fff" size={25} />
        </TouchableOpacity>
      ),
      headerShadowVisible: false,
    });
  }, [navigation]);

  return (
    <>
      <View style={tw`px-4 bg-[${s.colors.primary}] py-5`}>
        <Image
          source={{ uri: currentUserProfile.avatarImageUrl }}
          style={tw`rounded-full w-35 h-35 my-3 self-center`}
        />
      </View>

      <ScrollView style={tw`p-5`}>
        <View style={tw`mb-5`}>
          <Text style={tw`text-slate-500`}>Tên người dùng:</Text>
          <Text style={tw`text-lg`}>{currentUser.username}</Text>
        </View>

        <View style={tw`mb-5`}>
          <Text style={tw`text-slate-500`}>Email:</Text>
          <Text style={tw`text-lg`}>{currentUser.email}</Text>
        </View>

        <View style={tw`mb-5`}>
          <Text style={tw`text-slate-500`}>Số điện thoại:</Text>
          <Text style={tw`text-lg`}>{currentUser.phoneNumber}</Text>
        </View>

        <View style={tw`mb-5`}>
          <Text style={tw`text-slate-500`}>Số Zalo:</Text>
          <Text style={tw`text-lg`}>
            {!currentUserProfile.zaloNumber
              ? "Chưa có"
              : currentUserProfile.zaloNumber}
          </Text>
        </View>

        <View style={tw`mb-5`}>
          <Text style={tw`text-slate-500`}>Giới tính:</Text>
          <Text style={tw`text-lg`}>
            {currentUserProfile.gender === "MALE" ? "Nam" : "Nữ"}
          </Text>
        </View>

        <View style={tw`mb-5`}>
          <Text style={tw`text-slate-500`}>Ngày tháng năm sinh:</Text>
          <Text style={tw`text-lg`}>
            {format(new Date(currentUserProfile.dateOfBirth), "dd/MM/yyyy")}
          </Text>
        </View>

        <View style={tw`mb-5`}>
          <Text style={tw`text-slate-500`}>Trình độ chơi cầu lông:</Text>
          <Text style={tw`text-lg`}>
            {displayLevel(currentUserProfile.level)}
          </Text>
        </View>

        <View style={tw`mb-5 pb-6`}>
          <Text style={tw`text-slate-500`}>Thời gian chơi cầu lông:</Text>
          <Text style={tw`text-lg`}>
            {`${currentUserProfile.yearsOfExp} năm`}
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffSet: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default UserProfileScreen;
