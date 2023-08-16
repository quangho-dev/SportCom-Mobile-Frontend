import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";
import { useSelector } from "react-redux";

const HomeScreenHeaderTitle = ({ navigation }) => {
  const { user } = useSelector((store) => store.user);
  const { userProfile } = useSelector((store) => store.userProfile);

  return (
    <View style={tw`flex-1 flex-row items-center px-1 min-h-full`}>
      {userProfile && (
        <View>
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
        </View>
      )}

      {user && <Text>Xin chào {user.username}</Text>}
    </View>
  );
};

export default HomeScreenHeaderTitle;
