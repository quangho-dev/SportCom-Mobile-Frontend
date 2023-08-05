import { View, StyleSheet, Image } from "react-native";
import React from "react";
import tw from "twrnc";
import Icon from "react-native-vector-icons/AntDesign";
import { BASE_URL } from "@env";

export const AppFrontScreen = ({ navigation }) => {
  const handlePressSignUpBtn = () => {
    navigation.navigate("SignUp");
  };

  const handlePressLogInBtn = () => {
    navigation.navigate("LogIn");
  };

  return (
    <View style={tw`h-full`}>
      <Image
        source={require("../assets/badminton-front.jpg")}
        style={tw`w-full h-5/6`}
      />

      <View style={tw`flex-1 flex-row items-center justify-center bg-white`}>
        <View style={tw`mr-3`}>
          <Icon.Button
            name="adduser"
            backgroundColor="#F86F03"
            onPress={handlePressSignUpBtn}
            style={styles.button}
          >
            Đăng ký
          </Icon.Button>
        </View>

        <View style={tw`ml-3`}>
          <Icon.Button
            name="login"
            backgroundColor="#F86F03"
            onPress={handlePressLogInBtn}
            style={styles.button}
          >
            Đăng nhập
          </Icon.Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 4,
    elevation: 3,
  },
});

export default AppFrontScreen;
