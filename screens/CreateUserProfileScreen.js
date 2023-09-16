import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/auth-context";
import axios from "axios";
import { BASE_URL } from "@env";
import tw from "twrnc";
import { Formik } from "formik";
import * as yup from "yup";
const s = require("../style");
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import formatDate from "../utils/formatDate";
import { Picker } from "@react-native-picker/picker";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";

const CreateUserProfileScreen = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isPickerShow, setIsPickerShow] = useState(false);

  const authCtx = useContext(AuthContext);

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

  const pickImage = async (setFieldValue) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFieldValue("avatarImage", result.assets[0].uri);
    }
  };

  const showPicker = () => {
    setIsPickerShow(true);
  };

  const validationSchema = yup.object().shape({
    avatarImage: yup.mixed().required("Ảnh đại diện không được để trống"),
    username: yup.string().required("Tên người dùng không được để trống"),
    gender: yup.string().required("Giới tính không được để trống"),
    dateOfBirth: yup
      .mixed()
      .required("Ngày tháng năm sinh không được để trống"),
    level: yup.string().required("Trình độ chơi cầu không được để trống"),
    yearsOfExp: yup.string().required("Số năm kinh nghiệm không được để trống"),
    phoneNumber: yup.number().required("Số điện thoại không được để trống"),
  });

  const handleUploadAvatarImage = async (imageFile) => {
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "avatarImage");
    data.append("cloud_name", "sportcom");

    const result = await axios.post(
      "https://api.cloudinary.com/v1_1/sportcom/image/upload",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return result.data.secure_url;
  };

  return (
    <ScrollView style={tw`pt-6 px-7 flex-1 bg-white`}>
      <View style={tw`p-6 bg-white pb-15`}>
        <Text style={tw`text-center uppercase font-bold text-lg`}>
          Tạo thông tin của bạn
        </Text>

        <Formik
          initialValues={{
            avatarImage: "",
            username: currentUser ? currentUser.username : "",
            gender: "",
            dateOfBirth: null,
            level: "",
            yearsOfExp: "0",
            zaloNumber: "",
            phoneNumber: "",
          }}
          validationSchema={validationSchema}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            console.log("Submitting user profile...");

            setTimeout(async () => {
              console.log(" values.avatarImage,:", values.avatarImage);

              let newAvatarImageFile = {
                uri: values.avatarImage,
                type: `test/${getFileExtension(values.avatarImage)}`,
                name: `test.${getFileExtension(values.avatarImage)}`,
              };

              const avatarImageUrl = await handleUploadAvatarImage(
                newAvatarImageFile
              );

              console.log("avatarImageUrl:", avatarImageUrl);
              // try {
              //   const response = await axiosInstance.request(config);

              //   Toast.show({
              //     type: "success",
              //     text1: "Tạo thông tin cá nhân thành công!",
              //     visibilityTime: 2000,
              //   });

              //   setSubmitting(false);

              //   navigation.navigate("Home");
              // } catch (error) {
              //   console.log("error:", error);

              //   Toast.show({
              //     type: "error",
              //     text1: "Xin lỗi, đã xảy ra lỗi :(",
              //   });

              //   setSubmitting(false);
              // }
            }, 500);
          }}
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
            <>
              <View style={tw`items-center content-center mt-5 mb-4`}>
                {values.avatarImage ? (
                  <Image
                    source={{ uri: values.avatarImage }}
                    style={tw`rounded-full w-30 h-30 mb-3`}
                  />
                ) : (
                  <Image
                    source={require("../assets/blank-profile-picture.png")}
                    style={tw`rounded-full w-30 h-30 mb-3`}
                  />
                )}

                <Button
                  title="Chọn ảnh đại diện"
                  onPress={() => {
                    pickImage(setFieldValue);
                  }}
                  color={s.colors.primary}
                />

                {errors.avatarImage && touched.avatarImage && (
                  <Text style={{ fontSize: 14, color: "red" }}>
                    {errors.avatarImage}
                  </Text>
                )}
              </View>

              <View style={{ marginBottom: 3 }}>
                <Text>
                  <Text style={{ color: "red" }}>( * )</Text>: Trường bắt buộc
                </Text>
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`mb-1`}>
                  Tên người dùng: <Text style={{ color: "red" }}>( * )</Text>
                </Text>

                <TextInput
                  placeholder="Nguyễn Văn A"
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  style={styles.textInput}
                  value={values.username}
                />

                {errors.username && touched.username && (
                  <Text style={{ fontSize: 14, color: "red" }}>
                    {errors.username}
                  </Text>
                )}
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`mb-1`}>
                  Giới tính: <Text style={{ color: "red" }}>( * )</Text>
                </Text>

                <Picker
                  selectedValue={values.gender}
                  onValueChange={(itemValue, itemIndex) =>
                    setFieldValue("gender", itemValue)
                  }
                  style={styles.textInput}
                >
                  <Picker.Item label="Nam" value="MALE" />
                  <Picker.Item label="Nữ" value="FEMALE" />
                </Picker>

                {errors.gender && touched.gender && (
                  <Text style={{ fontSize: 14, color: "red" }}>
                    {errors.gender}
                  </Text>
                )}
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`mb-1`}>
                  Ngày tháng năm sinh:{" "}
                  <Text style={{ color: "red" }}>( * )</Text>
                </Text>

                <TextInput
                  placeholder="01/02/1990"
                  onChangeText={handleChange("dateOfBirth")}
                  onBlur={handleBlur("dateOfBirth")}
                  style={styles.textInput}
                  value={
                    values.dateOfBirth ? formatDate(values.dateOfBirth) : ""
                  }
                  onPressIn={showPicker}
                />
                {errors.dateOfBirth && touched.dateOfBirth && (
                  <Text style={{ fontSize: 14, color: "red" }}>
                    {errors.dateOfBirth}
                  </Text>
                )}
                {/* The date picker */}
                {isPickerShow && (
                  <DateTimePicker
                    value={
                      values.dateOfBirth
                        ? values.dateOfBirth
                        : new Date(Date.now())
                    }
                    mode={"date"}
                    display="spinner"
                    is24Hour={true}
                    onChange={(event, value) => {
                      if (Platform.OS === "android") {
                        setIsPickerShow(!isPickerShow);
                      }

                      setFieldValue("dateOfBirth", value);
                    }}
                    style={styles.datePicker}
                  />
                )}
              </View>

              <View style={tw`mb-6`}>
                <Text style={tw`mb-1`}>
                  Trình độ chơi cầu: <Text style={{ color: "red" }}>( * )</Text>
                </Text>

                <Picker
                  selectedValue={values.level}
                  onValueChange={(itemValue, itemIndex) =>
                    setFieldValue("level", itemValue)
                  }
                  style={styles.textInput}
                >
                  <Picker.Item label="Yếu" value="WEAK" />
                  <Picker.Item label="Trung bình" value="MEDIUM" />
                  <Picker.Item label="Trung bình+" value="MEDIUM_PLUS" />
                  <Picker.Item label="Khá" value="GOOD" />
                  <Picker.Item label="Khá+" value="GOOD_PLUS" />
                  <Picker.Item label="Giỏi" value="EXELLENT" />
                  <Picker.Item label="Giỏi+" value="EXELLENT_PLUS" />
                </Picker>

                {errors.level && touched.level && (
                  <Text style={{ fontSize: 14, color: "red" }}>
                    {errors.level}
                  </Text>
                )}
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`mb-1`}>
                  Số năm kinh nghiệm:{" "}
                  <Text style={{ color: "red" }}>( * )</Text>
                </Text>

                <TextInput
                  placeholder="2"
                  onChangeText={handleChange("yearsOfExp")}
                  onBlur={handleBlur("yearsOfExp")}
                  style={styles.textInput}
                  value={values.yearsOfExp}
                  keyboardType="numeric"
                />

                {errors.yearsOfExp && touched.yearsOfExp && (
                  <Text style={{ fontSize: 14, color: "red" }}>
                    {errors.yearsOfExp}
                  </Text>
                )}
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`mb-1`}>
                  Số điện thoại: <Text style={{ color: "red" }}>( * )</Text>
                </Text>

                <TextInput
                  placeholder="0771813765"
                  onChangeText={handleChange("phoneNumber")}
                  onBlur={handleBlur("phoneNumber")}
                  style={styles.textInput}
                  value={values.phoneNumber}
                  keyboardType="numeric"
                />

                {errors.phoneNumber && touched.phoneNumber && (
                  <Text style={{ fontSize: 14, color: "red" }}>
                    {errors.phoneNumber}
                  </Text>
                )}
              </View>

              <View style={tw`mb-4`}>
                <Text style={tw`mb-1`}>Số Zalo:</Text>

                <TextInput
                  placeholder="0771813765"
                  onChangeText={handleChange("zaloNumber")}
                  onBlur={handleBlur("zaloNumber")}
                  style={styles.textInput}
                  value={values.zaloNumber}
                  keyboardType="numeric"
                />
              </View>

              {isSubmitting ? (
                <ActivityIndicator size="large" color={s.colors.primary} />
              ) : (
                <Button
                  onPress={handleSubmit}
                  title="Lưu thông tin"
                  color={s.colors.primary}
                  accessibilityLabel="Send new account registration information"
                  disabled={!isValid}
                />
              )}
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signupContainer: {
    width: "80%",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
    elevation: 10,
    backgroundColor: "#e6e6e6",
  },
  textInput: {
    height: 40,
    width: "100%",
    backgroundColor: "#dadada",
    borderColor: "gray",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  errorText: {
    fontSize: 10,
    color: "red",
  },
  errorInput: {
    borderColor: "red",
  },
  pickedDateContainer: {
    padding: 20,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  pickedDate: {
    fontSize: 18,
    color: "black",
  },
  btnContainer: {
    padding: 30,
  },
  // This only works on iOS
  datePicker: {
    width: 320,
    height: 260,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export default CreateUserProfileScreen;
