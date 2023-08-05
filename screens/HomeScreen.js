import { View, Text, Button } from "react-native";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../store/auth-context";
import axios from "axios";
import { BASE_URL } from "@env";

const HomeScreen = ({ navigation }) => {
  const authCtx = useContext(AuthContext);

  if (!authCtx.isAuthenticated) {
    navigation.navigate("LogIn");
  }

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        const loggedInUserProfile = await axios.get(
          `${BASE_URL}/api/user-profiles/me`,
          { headers: { Authorization: `Bearer ${authCtx.token}` } }
        );

        if (!loggedInUserProfile) {
          navigation.navigate("CreateUserProfile");
          return;
        }
      } catch (error) {
        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.statusCode === 404
        ) {
          navigation.navigate("CreateUserProfile");
          return;
        }
      }
    };

    fetchCurrentUserProfile();
  }, []);

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
