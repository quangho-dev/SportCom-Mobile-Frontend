import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";

const HomeScreenHeaderTitle = ({
  navigation,
  currentUser,
  currentUserProfile,
}) => {
  return (
    <View style={tw`flex-1 flex-row items-center px-1 min-h-full`}>
      {currentUserProfile && (
        <View>
          <TouchableOpacity>
            <Image
              style={tw`rounded-full h-12 w-12 mr-2`}
              source={{
                uri: currentUserProfile.avatarImageUrl,
              }}
            />
          </TouchableOpacity>
        </View>
      )}

      {currentUser && <Text>Xin chào {currentUser.username}</Text>}
    </View>
  );
};

export default HomeScreenHeaderTitle;
