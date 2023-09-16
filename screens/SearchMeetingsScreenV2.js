import { View, Text } from "react-native";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import { BASE_URL } from "@env";
import { ActivityIndicator } from "react-native";
import MeetingsList from "../components/MeetingsList";
import { useCallback } from "react";
import tw from "twrnc";
import s from "../style";
import { setMeetings } from "../features/meeting/meetingSlice";

const SearchMeetingsScreenV2 = () => {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [clicked, setClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { token } = useSelector((store) => store.auth);
  const { meetings } = useSelector((store) => store.meeting);

  const dispatch = useDispatch();

  // get data from the api
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const fetchMeetings = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/meeting/latest-meetings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setMeetings(res.data));

      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
      console.log(error);
    }
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderStyle}>
        <ActivityIndicator size="large" color={s.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <SearchBar
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        clicked={clicked}
        setClicked={setClicked}
      />

      {meetings.length === 0 ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color={s.colors.primary} />
        </View>
      ) : (
        <MeetingsList
          searchPhrase={searchPhrase}
          data={meetings}
          setClicked={setClicked}
        />
      )}
    </>
  );
};

export default SearchMeetingsScreenV2;
