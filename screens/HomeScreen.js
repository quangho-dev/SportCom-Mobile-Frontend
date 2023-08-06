import { View, Text, Button } from "react-native";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../store/auth-context";
import axios from "axios";
import { BASE_URL } from "@env";
import { useLayoutEffect } from "react";
import HomeScreenHeaderTitle from "../components/HomeScreenHeaderTitle";
import { useState } from "react";

const HomeScreen = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  const authCtx = useContext(AuthContext);

  if (!authCtx.isAuthenticated) {
    navigation.navigate("LogIn");
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HomeScreenHeaderTitle
          navigation={navigation}
          currentUser={currentUser}
          currentUserProfile={currentUserProfile}
        />
      ),
      headerRight: () => (
        <View>
          <Button
            title="Out"
            onPress={() => {
              authCtx.logout();
            }}
          />
        </View>
      ),
    });
  }, [navigation, currentUser, currentUserProfile]);

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user-profiles/me`, {
          headers: { Authorization: `Bearer ${authCtx.token}` },
        });

        if (!res) {
          navigation.navigate("CreateUserProfile");
          return;
        }

        setCurrentUserProfile(res.data);
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

        if (
          error &&
          error.response &&
          error.response.data &&
          error.response.data.statusCode === 401
        ) {
          navigation.navigate("LogIn");
          return;
        }
      }
    };

    fetchCurrentUserProfile();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const res = await axios.get(`${BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${authCtx.token}`,
        },
      });

      setCurrentUser(res.data);
    };

    fetchCurrentUser();
  }, []);

  return (
    <View>
      <View></View>
    </View>
  );
};

export default HomeScreen;
