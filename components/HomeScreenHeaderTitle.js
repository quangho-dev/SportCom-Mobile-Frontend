import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";
import { useSelector } from "react-redux";
import UserAvatar from "react-native-user-avatar";

const HomeScreenHeaderTitle = ({ navigation, userProfile }) => {
  const user = useSelector((state) => state.user.user);

  return (
    <View style={tw`flex-1 flex-row items-center px-1 min-h-full`}>
      {userProfile && userProfile.avatarImageUrl ? (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("UserProfile");
          }}
        >
          <Image
            style={tw`rounded-full h-11 w-11 mr-2`}
            source={{
              uri: userProfile.avatarImageUrl,
            }}
          />
        </TouchableOpacity>
      ) : user && user.username ? (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("UserProfile");
          }}
        >
          <UserAvatar size={43} name={user.username} style={tw`mr-2`} />
        </TouchableOpacity>
      ) : null}
      {user && user.username && <Text>Xin chào {user.username}</Text>}
    </View>
  );
};

export default HomeScreenHeaderTitle;
