import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import * as yup from "yup";
import tw from "twrnc";
import axios from "axios";
import Toast from "react-native-toast-message";
import CustomInput from "../components/CustomInput";
import { Field, Formik } from "formik";
import { AuthContext } from "../store/auth-context";
import LoadingOverlay from "../components/ui/LoadingOverlay";
const s = require("../style");

const LogInScreen = ({ navigation }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  const logInValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Email không đúng")
      .required("Email không được để trống"),
    password: yup
      .string()
      .min(6, ({ min }) => `Mật khẩu phải có ít nhất ${min} ký tự`)
      .required("Mật khẩu không được để trống"),
  });

  if (isAuthenticating) {
    return <LoadingOverlay message="Đang đăng nhập..." />;
  }

  return (
    <View style={tw`flex-1 items-center justify-center bg-white`}>
      <View style={tw`p-6 bg-slate-200 rounded-lg shadow`}>
        <Text style={tw`text-center uppercase font-bold mb-5`}>Đăng nhập</Text>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={logInValidationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setTimeout(() => {
              axios
                .post(`http://192.168.127.211:3333/api/auth/signin`, values, {
                  headers: {
                    "Content-Type": "application/json",
                  },
                })
                .then((response) => {
                  Toast.show({
                    type: "success",
                    text1: "Đăng nhập thành công!",
                    visibilityTime: 2000,
                  });

                  authCtx.authenticate(response.data.access_token);
                })
                .catch((error) => {
                  console.log("error:", error);
                  if (
                    error.response?.data?.message === "Credentials incorrect"
                  ) {
                    Toast.show({
                      type: "error",
                      text1: "Tài khoản không đúng",
                    });

                    return;
                  }

                  Toast.show({
                    type: "error",
                    text1: "Xin lỗi, đã xảy ra lỗi :(",
                  });
                });

              setIsAuthenticating(false);
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ handleSubmit, isValid, isSubmitting }) => (
            <>
              <View style={tw`mb-4`}>
                <Field
                  component={CustomInput}
                  name="email"
                  placeholder="Địa chỉ email"
                  keyboardType="email-address"
                />
              </View>

              <View style={tw`mb-4`}>
                <Field
                  component={CustomInput}
                  name="password"
                  placeholder="Mật khẩu"
                  secureTextEntry
                />
              </View>

              {isSubmitting ? (
                <ActivityIndicator size="large" color={s.colors.primary} />
              ) : (
                <Button
                  onPress={handleSubmit}
                  title="Đăng nhập"
                  color={s.colors.primary}
                  accessibilityLabel="Send new account registration information"
                  disabled={!isValid}
                />
              )}

              <Text style={tw`mt-3`}>
                Bạn chưa có tài khoản? Hãy&nbsp;
                <Text
                  style={styles.signUpText}
                  onPress={() => navigation.navigate("SignUp")}
                >
                  đăng ký
                </Text>
              </Text>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },

  signUpText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default LogInScreen;
