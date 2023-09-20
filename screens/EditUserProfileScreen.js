import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  Button,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import tw from "twrnc";
import s from "../style";
import { Formik } from "formik";
import * as ImagePicker from "expo-image-picker";
import * as yup from "yup";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import formatDate from "../utils/formatDate";
import axios from "axios";
import Toast from "react-native-toast-message";
import { BASE_URL } from "@env";
import Spinner from "react-native-loading-spinner-overlay";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../features/user/userSlice";
import { setUserProfile } from "../features/userProfile/userProfileSlice";
import getFileExtension from "../utils/getFileExtension";

const EditUserProfileScreen = ({ navigation, route }) => {
  const [isPickerShow, setIsPickerShow] = useState(false);

  const { user } = useSelector((store) => store.user);
  const { token } = useSelector((store) => store.auth);
  const { userProfile } = useSelector((store) => store.userProfile);

  const dispatch = useDispatch();

  const showConfirmDialog = () => {
    return Alert.alert(
      "Bạn có chắc là muốn thay đổi thông tin cá nhân không?",
      null,
      [
        {
          text: "Không",
        },
        {
          text: "Có",
          onPress: () => {
            submitHandler();
          },
        },
      ]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      presentation: "modal",
      title: "Chỉnh sửa thông tin",
      headerTitleAlign: "center",
      headerTitleStyle: {
        fontWeight: "bold",
      },
      headerStyle: {
        backgroundColor: s.colors.primary,
      },
      headerShadowVisible: false,
      headerTintColor: "#fff",
    });
  }, [navigation]);

  const formRef = useRef();

  function submitHandler() {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  }

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
    <Formik
      initialValues={{
        avatarImage:
          userProfile && userProfile.avatarImageUrl
            ? userProfile.avatarImageUrl
            : "",
        username: user ? user.username : "",
        gender: userProfile && userProfile.gender ? userProfile.gender : "",
        dateOfBirth:
          userProfile && userProfile.dateOfBirth
            ? userProfile.dateOfBirth
            : null,
        level: userProfile && userProfile.level ? userProfile.level : "",
        yearsOfExp:
          userProfile && userProfile.yearsOfExp ? userProfile.yearsOfExp : "0",
        zaloNumber:
          userProfile && userProfile.zaloNumber ? userProfile.zaloNumber : "",
        phoneNumber: user ? user.phoneNumber : "",
      }}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(async () => {
          try {
            let newAvatarImageUrl = "";
            if (
              userProfile &&
              userProfile.avatarImageUrl !== values.avatarImage
            ) {
              let newAvatarImageFile = {
                uri: values.avatarImage,
                type: `test/${getFileExtension(values.avatarImage)}`,
                name: `test.${getFileExtension(values.avatarImage)}`,
              };

              const avatarImageUrl = await handleUploadAvatarImage(
                newAvatarImageFile
              );

              newAvatarImageUrl = avatarImageUrl;
            } else if (!userProfile) {
              let newAvatarImageFile = {
                uri: values.avatarImage,
                type: `test/${getFileExtension(values.avatarImage)}`,
                name: `test.${getFileExtension(values.avatarImage)}`,
              };

              const avatarImageUrl = await handleUploadAvatarImage(
                newAvatarImageFile
              );

              newAvatarImageUrl = avatarImageUrl;
            }

            let newDateOfBirth = "";
            if (userProfile && userProfile.dateOfBirth !== values.dateOfBirth) {
              const convertedDate = values.dateOfBirth.toISOString();

              newDateOfBirth = convertedDate;
            } else if (!userProfile) {
              const convertedDate = values.dateOfBirth.toISOString();

              newDateOfBirth = convertedDate;
            }

            let data = {
              username: values.username,
              avatarImageUrl: newAvatarImageUrl
                ? newAvatarImageUrl
                : userProfile.avatarImageUrl,
              dateOfBirth: newDateOfBirth
                ? newDateOfBirth
                : userProfile.dateOfBirth,
              level: values.level,
              gender: values.gender,
              yearsOfExp: values.yearsOfExp,
              phoneNumber: values.phoneNumber,
              zaloNumber: values.zaloNumber,
            };

            const response = await axios.post(
              `${BASE_URL}/api/user-profiles/create-user-profile-v3`,
              data,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log("response.data:", response.data);

            const { username, phoneNumber, email } = response.data;
            dispatch(
              setUser({
                email,
                username,
                phoneNumber,
              })
            );

            delete response.data.username;
            delete response.data.phoneNumber;
            delete response.data.email;

            dispatch(setUserProfile(response.data));

            Toast.show({
              type: "success",
              text1: "Tạo thông tin cá nhân thành công!",
            });

            setSubmitting(false);

            navigation.navigate("UserProfile");
          } catch (error) {
            console.log("error:", error);
            Toast.show({
              type: "error",
              text1: "Xin lỗi, đã xảy ra lỗi :(",
            });

            setSubmitting(false);
          }
        });
      }}
      innerRef={formRef}
    >
      {({
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
          <View style={tw`px-4 bg-[${s.colors.primary}] py-5`}>
            <View style={tw`relative`}>
              {values.avatarImage ? (
                <Image
                  source={{ uri: values.avatarImage }}
                  style={tw`rounded-full w-35 h-35 my-3 self-center`}
                />
              ) : (
                <Image
                  source={require("../assets/blank-profile-picture.png")}
                  style={tw`rounded-full w-35 h-35 my-3 self-center`}
                />
              )}

              <TouchableOpacity
                style={tw`absolute bottom-3 right-25 flex items-center content-center p-2 bg-slate-600 rounded-full`}
                onPress={() => {
                  pickImage(setFieldValue);
                }}
              >
                <Ionicons name="camera-outline" color="#FFF" size={25} />
              </TouchableOpacity>

              {errors.avatarImage && touched.avatarImage && (
                <Text style={{ fontSize: 14, color: "red" }}>
                  {errors.avatarImage}
                </Text>
              )}
            </View>
          </View>

          <ScrollView style={tw`p-5`}>
            <View style={{ marginBottom: 14 }}>
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

            <View style={tw`mb-7`}>
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
                <Picker.Item label="Chọn" value="" />
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
                Ngày tháng năm sinh: <Text style={{ color: "red" }}>( * )</Text>
              </Text>

              <TextInput
                placeholder="01/02/1990"
                onChangeText={handleChange("dateOfBirth")}
                onBlur={handleBlur("dateOfBirth")}
                style={styles.textInput}
                value={formatDate(new Date(values.dateOfBirth))}
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
                      ? new Date(values.dateOfBirth)
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
                Số năm kinh nghiệm: <Text style={{ color: "red" }}>( * )</Text>
              </Text>

              <TextInput
                onChangeText={handleChange("yearsOfExp")}
                onBlur={handleBlur("yearsOfExp")}
                style={styles.textInput}
                value={values.yearsOfExp.toString()}
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
                value={values.zaloNumber.toString()}
                keyboardType="numeric"
              />
            </View>

            <View style={tw`mb-4 pb-10`}>
              <Button
                disabled={!isValid}
                color={s.colors.primary}
                onPress={showConfirmDialog}
                title="Gửi"
              />
            </View>
          </ScrollView>

          <View style={styles.container}>
            <Spinner
              //visibility of Overlay Loading Spinner
              visible={isSubmitting}
              //Text with the Spinner
              textContent={"Đang xử lý..."}
              //Text style of the Spinner Text
              textStyle={styles.spinnerTextStyle}
            />
          </View>
        </>
      )}
    </Formik>
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
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 30,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});

export default EditUserProfileScreen;
