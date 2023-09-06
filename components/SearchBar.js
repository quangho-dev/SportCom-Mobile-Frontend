import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { Button } from "react-native";
import { Keyboard } from "react-native";
import s from "../style";

const SearchBar = (props) => {
  return (
    <View style={styles.container}>
      <View
        style={
          !props.clicked
            ? styles.searchBar__unclicked
            : styles.searchBar__clicked
        }
      >
        <Feather
          name="search"
          size={20}
          color="black"
          style={{ marginLeft: 1 }}
        />
        <TextInput
          style={styles.input}
          placeholder="Tìm bằng địa chỉ/ tên sân"
          value={props.searchPhrase}
          onChangeText={props.setSearchPhrase}
          onFocus={() => {
            props.setClicked(true);
          }}
          multiline={true}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {props.clicked && (
          <Entypo
            name="cross"
            size={20}
            color="black"
            style={{ padding: 1 }}
            onPress={() => {
              props.setSearchPhrase("");
            }}
          />
        )}
      </View>
      {props.clicked && (
        <View style={styles.cancelBtn}>
          <Button
            title="Hủy"
            onPress={() => {
              Keyboard.dismiss();
              props.setClicked(false);
            }}
            color={s.colors.primary}
          ></Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    width: "90%",
  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: "row",
    width: "80%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    width: "90%",
    height: 30,
  },
  cancelBtn: {
    marginLeft: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default SearchBar;
