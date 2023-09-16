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
import CustomInput from "../components/CustomInput";
import { Field, Formik } from "formik";
import LoadingOverlay from "../components/ui/LoadingOverlay";
const s = require("../style");
import { useDispatch } from "react-redux";
import { signinUser } from "../features/auth/authSlice";

const LogInScreen = ({ navigation }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const dispatch = useDispatch();

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
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              dispatch(signinUser(values));

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
                  autoCapitalize="none"
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
  },
});

export default LogInScreen;
