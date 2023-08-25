import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Field, Formik } from "formik";
import tw from "twrnc";
import * as yup from "yup";
import CustomInput from "../components/CustomInput";
const s = require("../style");
import { useDispatch } from "react-redux";
import { signupUser } from "../features/auth/authSlice";

const SignUpScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const signUpValidationSchema = yup.object().shape({
    username: yup.string().required("Tên người dùng không được để trống"),
    phoneNumber: yup.string().required("Số điện thoại không được để trống"),
    email: yup
      .string()
      .email("Email không đúng")
      .required("Email không được để trống"),
    password: yup
      .string()
      .min(6, ({ min }) => `Mật khẩu phải có ít nhất ${min} ký tự`)
      .required("Mật khẩu không được để trống"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Mật khẩu không trùng khớp")
      .required("Xác nhận mật khẩu không được để trống"),
  });

  return (
    <View style={tw`flex-1 items-center justify-center bg-white`}>
      <View style={tw`p-6 bg-slate-200 rounded-lg shadow`}>
        <Text style={tw`text-center uppercase font-bold mb-5`}>
          Đăng ký tài khoản
        </Text>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
          }}
          validationSchema={signUpValidationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setTimeout(() => {
              delete values.confirmPassword;

              dispatch(signupUser(values));

              setSubmitting(false);
            }, 400);
          }}
        >
          {({ handleSubmit, isValid, isSubmitting }) => (
            <>
              <View style={tw`mb-4`}>
                <Field
                  component={CustomInput}
                  name="username"
                  placeholder="Tên người dùng"
                />
              </View>

              <View style={tw`mb-4`}>
                <Field
                  component={CustomInput}
                  name="phoneNumber"
                  placeholder="Số điện thoại"
                  keyboardType="numeric"
                />
              </View>

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

              <View style={tw`mb-4`}>
                <Field
                  component={CustomInput}
                  name="confirmPassword"
                  placeholder="Xác nhận lại mật khẩu"
                  secureTextEntry
                />
              </View>

              {isSubmitting ? (
                <ActivityIndicator size="large" color={s.colors.primary} />
              ) : (
                <Button
                  onPress={handleSubmit}
                  title="Đăng ký"
                  color={s.colors.primary}
                  accessibilityLabel="Send new account registration information"
                  disabled={!isValid}
                />
              )}

              <Text style={tw`mt-3`}>
                Bạn đã có tài khoản? Hãy&nbsp;
                <Text
                  style={styles.logInText}
                  onPress={() => navigation.navigate("LogIn")}
                >
                  đăng nhập
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

  logInText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default SignUpScreen;
