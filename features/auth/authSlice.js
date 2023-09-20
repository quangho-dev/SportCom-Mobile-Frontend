import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "../user/userSlice";
import Toast from "react-native-toast-message";

const initialState = {
  token: null,
  access_token: "",
  refresh_token: "",
  user: null,
  error: null,
  isLoading: false,
};

export const addToken = createAsyncThunk("addtoken", async () => {
  const result = await AsyncStorage.getItem("token");
  return result;
});

export const signinUser = createAsyncThunk(
  "signinUser",
  async (values, thunkAPI) => {
    console.log("log in...");
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signin`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      thunkAPI.dispatch(getCurrentUser(response.data.access_token));

      return response.data;
    } catch (error) {
      // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);

export const signupUser = createAsyncThunk(
  "signupUser",
  async (values, thunkAPI) => {
    console.log("Starting to sign up...!");
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signup`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      thunkAPI.dispatch(getCurrentUser(response.data.access_token));

      return response.data.access_token;
    } catch (error) {
      // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      } else {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state, action) => {
      state.token = null;
      AsyncStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToken.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(signinUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.access_token;
        state.user = action.payload.user;
        AsyncStorage.setItem("token", action.payload.access_token);

        Toast.show({
          type: "success",
          text1: "Đăng nhập thành công!",
        });
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;

        if (action.payload === "Credentials incorrect") {
          Toast.show({
            type: "error",
            text1: "Tài khoản không đúng",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Xin lỗi, đã xảy ra lỗi :(",
          });
        }
      })
      .addCase(signupUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload;
        AsyncStorage.setItem("token", action.payload);

        Toast.show({
          type: "success",
          text1: "Đăng ký tài khoản thành công!",
        });
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;

        if (action.payload === "This account has already existed") {
          Toast.show({
            type: "error",
            text1: "Email này đã tồn tại!",
          });
        } else {
          Toast.show({
            type: "error",
            text1: action.payload,
          });
        }
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
