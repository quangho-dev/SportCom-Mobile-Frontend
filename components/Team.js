import { View, Text, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import tw from "twrnc";
import { StyleSheet } from "react-native";

const Team = ({ team }) => {
  return (
    <TouchableOpacity
      style={[tw`p-3 bg-[#fff] my-2 rounded-lg flex-row w-full`, styles.shadow]}
    >
      <Image
        source={{
          uri: team.imageUrl,
        }}
        style={tw`rounded-sm w-10 h-10`}
      />

      <View style={tw`pl-2`}>
        <Text style={tw`font-bold`}>{team.teamName}</Text>
        <Text style={tw``}>{team.courseName}</Text>
      </View>

      <View style={tw`ml-auto`}>
        <Text style={tw``}>{team.playingTime}</Text>
        <Text style={tw``}>{team.fee}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
});
export default Team;
