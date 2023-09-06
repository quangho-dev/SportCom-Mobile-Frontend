import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native";
import Meeting from "./Meeting";
import tw from "twrnc";

const MeetingsList = (props) => {
  const renderItem = ({ item }) => {
    // when no input, show all
    if (props.searchPhrase === "") {
      return <Meeting meeting={item} />;
    }

    // filter of the course name
    if (
      item.courseName
        .toUpperCase()
        .includes(props.searchPhrase.toUpperCase().trim().replace(/\s/g, ""))
    ) {
      return <Meeting meeting={item} />;
    }

    // filter of the address
    if (
      item.address
        .toUpperCase()
        .includes(props.searchPhrase.toUpperCase().trim().replace(/\s/g, ""))
    ) {
      return <Meeting meeting={item} />;
    }
  };

  return (
    <View
      onStartShouldSetResponder={() => {
        props.setClicked(false);
      }}
      style={tw`mx-auto w-full`}
    >
      <FlatList
        data={props.data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 150 }}
      />
    </View>
  );
};

export default MeetingsList;

const styles = StyleSheet.create({
  list__container: {
    margin: 10,
    height: "85%",
    width: "100%",
  },
  item: {
    margin: 30,
    borderBottomWidth: 2,
    borderBottomColor: "lightgrey",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    fontStyle: "italic",
  },
});
