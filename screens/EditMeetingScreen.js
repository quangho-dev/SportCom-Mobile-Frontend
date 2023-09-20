import { View, Text, Button, TextInput, ScrollView } from "react-native";
import React from "react";
import { Formik } from "formik";
import tw from "twrnc";
import s from "../style";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";
import * as yup from "yup";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import axios from "axios";
import getFileExtension from "../utils/getFileExtension";
import { useDispatch } from "react-redux";
import { updateMeeting } from "../features/meeting/meetingSlice";
import Spinner from "react-native-loading-spinner-overlay";
import transformLevelArray from "../utils/transformLevelArray";
import { Alert } from "react-native";
import { useRef } from "react";

const EditMeetingScreen = ({ navigation, route }) => {
  const [selected, setSelected] = React.useState([]);

  const meeting = route.params.meeting;

  const dispatch = useDispatch();

  const data = [
    { key: "NEWBIE", value: "Yếu" },
    { key: "MEDIUM", value: "Trung Bình" },
    { key: "MEDIUM_PLUS", value: "Trung Bình+" },
    { key: "GOOD", value: "Khá" },
    { key: "GOOD_PLUS", value: "Khá+" },
    { key: "EXELLENT", value: "Giỏi" },
    { key: "EXELLENT_PLUS", value: "Giỏi+" },
  ];

  const handleUploadImage = async (imageFile) => {
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "meetingImage");
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

  const handleUploadVideo = async (videoFile) => {
    const data = new FormData();
    data.append("file", videoFile);
    data.append("upload_preset", "meetingVideo");
    data.append("cloud_name", "sportcom");

    const result = await axios.post(
      "https://api.cloudinary.com/v1_1/sportcom/video/upload",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return result.data.secure_url;
  };

  const video = React.useRef(null);

  const initialValues = {
    title: meeting.title ? meeting.title : "",
    teamName: meeting.teamName ? meeting.teamName : "",
    meetingImage: meeting.imageUrl ? meeting.imageUrl : "",
    meetingVideo: meeting.videoUrl ? meeting.videoUrl : "",
    courseName: meeting.courseName ? meeting.courseName : "",
    address: meeting.address ? meeting.address : "",
    courseNumbers: meeting.courseNumbers ? meeting.courseNumbers : "",
    playingTime: meeting.playingTime ? meeting.playingTime : "",
    fee: meeting.fee ? meeting.fee : "",
    phoneNumber: meeting.phoneNumber ? meeting.phoneNumber : "",
    zaloNumber: meeting.zaloNumber ? meeting.zaloNumber : "",
    levels: meeting.levels ? meeting.levels : [],
    description: meeting.description ? meeting.description : "",
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required("Tựa đề không được để trống"),
    teamName: yup.string().required("Tên hội không được để trống"),
    meetingImage: yup.mixed().required("Hình ảnh không được để trống"),
    courseName: yup.string().required("Tên hội không được để trống"),
    address: yup.string().required("Địa chỉ sân không được để trống"),
    courseNumbers: yup.string().required("Số sân không được để trống"),
    playingTime: yup.string().required("Thời gian chơi không được để trống"),
    fee: yup.string().required("Chi phí không được để trống"),
    phoneNumber: yup.string().required("Số điện thoại không được để trống"),
    levels: yup.array().min(1, "Cần chọn ít nhất 1 trình độ"),
    description: yup.string().required("Miêu tả thêm không được để trống"),
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
      setFieldValue("meetingImage", result.assets[0].uri);
    }
  };

  const pickVideo = async (setFieldValue) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Videos",
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFieldValue("meetingVideo", result.assets[0].uri);
    }
  };

  const formRef = useRef();

  function submitHandler() {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  }

  const showConfirmDialog = () => {
    return Alert.alert("Bạn có chắc muốn chỉnh sửa buổi chơi không?", null, [
      {
        text: "Không",
      },
      {
        text: "Có",
        onPress: () => {
          submitHandler();
        },
      },
    ]);
  };

  return (
    <ScrollView style={tw`p-4`} showsVerticalScrollIndicator={false}>
      <Formik
        innerRef={formRef}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          let updateImageUrl = "";
          if (values.meetingImage !== meeting.imageUrl) {
            let newImageFile = {
              uri: values.meetingImage,
              type: `test/${getFileExtension(values.meetingImage)}`,
              name: `test.${getFileExtension(values.meetingImage)}`,
            };

            updateImageUrl = await handleUploadImage(newImageFile);
          } else {
            updateImageUrl = meeting.imageUrl;
          }

          let updateVideoUrl = "";
          if (values.meetingVideo !== meeting.videoUrl) {
            let newVideoFile = {
              uri: values.meetingVideo,
              type: `test/${getFileExtension(values.meetingVideo)}`,
              name: `test.${getFileExtension(values.meetingVideo)}`,
            };

            updateVideoUrl = await handleUploadVideo(newVideoFile);
          } else {
            updateVideoUrl = meeting.videoUrl;
          }

          let data = {
            id: meeting.id,
            title: values.title,
            teamName: values.teamName,
            courseName: values.courseName,
            courseNumbers: values.courseNumbers,
            address: values.address,
            phoneNumber: values.phoneNumber,
            zaloNumber: values.zaloNumber,
            playingTime: values.playingTime,
            fee: values.fee,
            levels: values.levels,
            description: values.description,
            imageUrl: updateImageUrl,
            videoUrl: updateVideoUrl,
          };

          dispatch(updateMeeting(data));

          setSubmitting(false);

          navigation.navigate("MeetingDetails", {
            meetingId: meeting.id,
          });
        }}
      >
        {({
          setFieldValue,
          values,
          handleChange,
          handleBlur,
          isValid,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
            <View style={tw`mb-3`}>
              <Text style={tw`font-bold text-base mb-1`}>
                Tựa đề: <Text style={{ color: "red" }}>( * )</Text>
              </Text>

              <TextInput
                placeholder="Nhóm cần tuyển thêm thành viên vãng lai hoặc cố định"
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                style={styles.textInput}
                value={values.title}
                multiline
                numberOfLines={5}
              />

              {errors.title && touched.title && (
                <Text style={styles.textError}>{errors.title}</Text>
              )}
            </View>

            <View style={tw`mb-3`}>
              <Text style={tw`font-bold text-base mb-1`}>
                Tên hội: <Text style={{ color: "red" }}>( * )</Text>
              </Text>

              <TextInput
                placeholder="Câu lạc bộ Zolado"
                onChangeText={handleChange("teamName")}
                onBlur={handleBlur("teamName")}
                style={styles.textInput}
                value={values.teamName}
              />

              {errors.teamName && touched.teamName && (
                <Text style={styles.textError}>{errors.teamName}</Text>
              )}
            </View>

            <View style={tw`mb-4`}>
              <Text style={tw`mb-1 text-base font-bold`}>
                Hình ảnh: <Text style={{ color: "red" }}>( * )</Text>
              </Text>
              {values.meetingImage && (
                <Image
                  source={{ uri: values.meetingImage }}
                  style={tw`rounded-sm w-full h-60 mb-3`}
                />
              )}

              <View style={tw`w-1/2 self-center`}>
                <Button
                  onPress={() => {
                    pickImage(setFieldValue);
                  }}
                  color={s.colors.primary}
                  title="Tải ảnh"
                  accessibilityLabel="Upload meeting image"
                />
              </View>

              {errors.meetingImage && touched.meetingImage && (
                <Text style={styles.textError}>{errors.meetingImage}</Text>
              )}
            </View>

            <View style={tw`mb-3`}>
              <Text style={tw`text-base font-bold`}>Video:</Text>
              <Text style={tw`text-base mb-2`}>
                Hãy tải video về một trận đấu của hội của bạn, để mọi người có
                thể thấy trình độ đánh cầu của hội.
              </Text>
              {values.meetingVideo && (
                <View>
                  <Video
                    ref={video}
                    style={styles.video}
                    source={{
                      uri: values.meetingVideo,
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                  />
                </View>
              )}

              <View style={tw`mt-2 self-center w-1/2`}>
                <Button
                  onPress={() => {
                    pickVideo(setFieldValue);
                  }}
                  color={s.colors.primary}
                  title="Tải video"
                  accessibilityLabel="Upload meeting video"
                />
              </View>

              {errors.meetingVideo && touched.meetingVideo && (
                <Text style={styles.textError}>{errors.meetingVideo}</Text>
              )}
            </View>

            <View style={tw`mb-3`}>
              <Text style={tw`font-bold text-base mb-1`}>
                Tên sân: <Text style={{ color: "red" }}>( * )</Text>
              </Text>

              <TextInput
                placeholder="Sân Gia Bảo"
                onChangeText={handleChange("courseName")}
                onBlur={handleBlur("courseName")}
                style={styles.textInput}
                value={values.courseName}
              />

              {errors.courseName && touched.courseName && (
                <Text style={styles.textError}>{errors.courseName}</Text>
              )}
            </View>

            <View style={tw`mb-3`}>
              <Text style={tw`font-bold text-base mb-1`}>
                Địa chỉ: <Text style={{ color: "red" }}>( * )</Text>
              </Text>

              <TextInput
                placeholder="426 Đ. Cây Trâm, Phường 9, Gò Vấp, Thành phố Hồ Chí Minh"
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                style={styles.textInput}
                value={values.address}
              />

              {errors.address && touched.address && (
                <Text style={styles.textError}>{errors.address}</Text>
              )}
            </View>

            <View style={tw`mb-3`}>
              <Text style={tw`font-bold text-base mb-1`}>
                Số sân: <Text style={{ color: "red" }}>( * )</Text>
              </Text>

              <TextInput
                placeholder="Sân số 4, 5"
                onChangeText={handleChange("courseNumbers")}
                onBlur={handleBlur("courseNumbers")}
                style={styles.textInput}
                value={values.courseNumbers}
              />

              {errors.courseNumbers && touched.courseNumbers && (
                <Text style={styles.textError}>{errors.courseNumbers}</Text>
              )}
            </View>

            <View style={tw`mb-3`}>
              <Text style={tw`font-bold text-base mb-1`}>
                Thời gian chơi: <Text style={{ color: "red" }}>( * )</Text>
              </Text>

              <TextInput
                placeholder="20:00 - 22:00, các ngày 2 - 4 -6"
                onChangeText={handleChange("playingTime")}
                onBlur={handleBlur("playingTime")}
                style={styles.textInput}
                value={values.playingTime}
              />

              {errors.playingTime && touched.playingTime && (
                <Text style={styles.textError}>{errors.playingTime}</Text>
              )}
            </View>

            <View style={tw`mb-3`}>
              <Text style={tw`font-bold text-base mb-1`}>
                Chi phí: <Text style={{ color: "red" }}>( * )</Text>
              </Text>

              <TextInput
                placeholder="Nam: 80K, nữ: 70K"
                onChangeText={handleChange("fee")}
                onBlur={handleBlur("fee")}
                style={styles.textInput}
                value={values.fee}
              />

              {errors.fee && touched.fee && (
                <Text style={styles.textError}>{errors.fee}</Text>
              )}
            </View>

            <View style={tw`mb-3`}>
              <Text style={tw`font-bold text-base mb-1`}>
                Trình độ: <Text style={{ color: "red" }}>( * )</Text>
              </Text>

              <MultipleSelectList
                setSelected={(val) => setSelected(val)}
                data={data}
                save="key"
                onSelect={() => {
                  setFieldValue("levels", selected);
                }}
                label="Đã chọn"
                placeholder="Chọn một vài trình độ"
              />

              {values.levels.length > 0 && (
                <View style={styles.currentLevelsWrapper}>
                  <Text style={styles.currentLevelsText}>
                    Các trình độ hiện tại:&nbsp;
                  </Text>
                  <Text>{transformLevelArray(meeting.levels)}</Text>
                </View>
              )}

              {errors.levels && touched.levels && (
                <Text style={styles.textError}>{errors.levels}</Text>
              )}
            </View>

            <View style={tw`mb-3`}>
              <Text style={tw`font-bold text-base mb-1`}>
                Số điện thoại: <Text style={{ color: "red" }}>( * )</Text>
              </Text>

              <TextInput
                placeholder="0974179423"
                onChangeText={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
                style={styles.textInput}
                value={values.phoneNumber}
              />

              {errors.phoneNumber && touched.phoneNumber && (
                <Text style={styles.textError}>{errors.phoneNumber}</Text>
              )}
            </View>

            <View style={tw`mb-3`}>
              <Text style={tw`font-bold text-base mb-1`}>Số Zalo:</Text>

              <TextInput
                placeholder="0974179423"
                onChangeText={handleChange("zaloNumber")}
                onBlur={handleBlur("zaloNumber")}
                style={styles.textInput}
                value={values.zaloNumber}
              />
            </View>

            <View style={tw`mb-3`}>
              <Text style={tw`font-bold text-base mb-1`}>
                Miêu tả thêm: <Text style={{ color: "red" }}>( * )</Text>
              </Text>

              <TextInput
                placeholder="Nhóm vui vẻ, hoà đồng, nhiệt tình, đặc biệt có các tiết mục giao ly sau giờ đánh như chè, sinh tố..."
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                style={styles.multilineTextInput}
                value={values.description}
                multiline
                numberOfLines={7}
              />

              {errors.description && touched.description && (
                <Text style={styles.textError}>{errors.description}</Text>
              )}
            </View>

            <View style={{ marginBottom: 3 }}>
              <Text>
                <Text style={{ color: "red" }}>( * )</Text>: Trường bắt buộc
              </Text>
            </View>

            <View style={tw`mt-3 mb-10`}>
              <Button
                color={s.colors.primary}
                title="Gửi"
                onPress={showConfirmDialog}
                disabled={!isValid}
              />
            </View>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  video: {
    width: 400,
    height: 170,
    marginBottom: 9,
    alignSelf: "center",
  },
  buttons: {
    width: "50%",
    alignSelf: "center",
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
  multilineTextInput: {
    width: "100%",
    backgroundColor: "#dadada",
    borderColor: "gray",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  textError: { fontSize: 14, color: "red", marginTop: 2 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  currentLevelsWrapper: {
    flexDirection: "row",
  },
  currentLevelsText: {
    fontWeight: "bold",
  },
});

export default EditMeetingScreen;
