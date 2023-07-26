import { View, Text, Button } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../store/auth-context";

const HomeScreen = () => {
  const authCtx = useContext(AuthContext);

  return (
    <View>
      <Button
        title="Out"
        onPress={() => {
          authCtx.logout();
        }}
      />
    </View>
  );
};

export default HomeScreen;
