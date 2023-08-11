import { View, Image, StyleSheet, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import { TouchableOpacity } from "react-native";

const NewestMeet = () => {
  return (
    <TouchableOpacity style={[tw`w-70 mr-4 rounded-b-lg mb-4`, styles.shadow]}>
      <Image
        source={require("../assets/newest-meeting-dummy.jpg")}
        style={tw`rounded-t-lg w-full h-40`}
      />

      <View style={tw`bg-white rounded-b-lg p-4`}>
        <View style={tw`flex-row`}>
          <Text style={tw`font-bold`}>Tên sân:&nbsp;</Text>
          <Text>Sân Gia Bảo</Text>
        </View>

        <View style={tw`flex-row`}>
          <Text style={tw`font-bold`}>Thời gian:&nbsp;</Text>
          <Text>2 - 4 - 6</Text>
        </View>

        <View style={tw`flex-row max-w-55`}>
          <Text style={tw`font-bold`}>Địa chỉ:&nbsp;</Text>
          <Text>183/53 - đường số 10 - P.8 - Q.Gò Vấp</Text>
        </View>

        <View style={tw`flex-row`}>
          <Text style={tw`font-bold`}>Tên CLB:&nbsp;</Text>
          <Text>Top Brackets</Text>
        </View>

        <View style={tw`flex-row`}>
          <Text style={tw`font-bold`}>Trình độ:&nbsp;</Text>
          <Text>TB, Khá</Text>
        </View>

        <View style={tw`flex-row`}>
          <Text style={tw`font-bold`}>Phí:&nbsp;</Text>
          <Text>Nam 80K, Nữ 70K</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageOverlay: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    opacity: 0.3,
    backgroundColor: "black",
    zIndex: 3,
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

export default NewestMeet;
