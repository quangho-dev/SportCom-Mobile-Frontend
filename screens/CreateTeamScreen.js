import { View, Text, Button } from "react-native";
import React from "react";
import tw from "twrnc";
import { Image } from "react-native";
import { useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { Formik } from "formik";
import s from "../style";
import * as ImagePicker from "expo-image-picker";
import Video from "react-native-video";

const CreateTeamScreen = () => {
  const [isPickerShow, setIsPickerShow] = useState(false);

  const pickImage = async (setFieldValue) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFieldValue("imageUrl", result.assets[0].uri);
    }
  };

  const showPicker = () => {
    setIsPickerShow(true);
  };

  const initialValues = {
    teamName: "",
    address: "",
    phoneNumber: "",
    zaloNumber: "",
    courseName: "",
    playingTime: "",
    description: "",
    level: "",
    fee: "",
    imageUrl: "",
    videoUrl: "",
  };

  return (
    <Formik
      onSubmit={(values) => {
        console.log("values:", values);
      }}
      initialValues={initialValues}
    >
      {({
        handleSubmit,
        isValid,
        values,
        errors,
        setFieldValue,
        handleChange,
        handleBlur,
        isSubmitting,
        touched,
      }) => (
        <View style={tw`p-5`}>
          <View style={tw``}>
            <Text style={tw`text-base mb-2`}>Ảnh đại diện câu lạc bộ:</Text>

            {values.imageUrl ? (
              <View style={[styles.imageContainer, tw`mb-3`]}>
                <Image source={{ uri: values.imageUrl }} style={styles.image} />
              </View>
            ) : (
              <View style={[styles.imageContainer, tw`mb-3`]}>
                <Image
                  source={require("../assets/upload-png-image-file.png")}
                  style={styles.image}
                />
              </View>
            )}

            <Button
              title="Chọn ảnh đại diện"
              onPress={() => {
                pickImage(setFieldValue);
              }}
              color={s.colors.primary}
            />
          </View>
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
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
  imageContainer: {
    width: 280,
    height: 185,
    alignSelf: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
});

export default CreateTeamScreen;
