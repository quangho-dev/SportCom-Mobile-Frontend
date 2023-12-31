import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const url = `${BASE_URL}/api/auth/me`;

const initialState = {
  user: null,
  isLoading: true,
};

export const getCurrentUser = createAsyncThunk(
  "user/getCurrentUser",
  async (token, thunkAPI) => {
    console.log("tokenn:", token);
    try {
      const resp = await axios(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("resp", resp);

      return resp.data;
    } catch (error) {
      console.log("error:", error);

      return thunkAPI.rejectWithValue("Xin lỗi, đã xảy ra lỗi.");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
      });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
