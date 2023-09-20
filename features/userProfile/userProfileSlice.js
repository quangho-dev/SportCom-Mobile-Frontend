import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "@env";

const url = `${BASE_URL}/api/user-profiles/me`;

const initialState = {
  userProfile: null,
  isLoading: true,
};

export const getUserProfile = createAsyncThunk(
  "userProfile/getUserProfile",
  async (token, thunkAPI) => {
    console.log("get user profile");
    try {
      const resp = await axios(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return resp.data;
    } catch (error) {
      console.log("error:", error);
      return thunkAPI.rejectWithValue("Xin lỗi, đã xảy ra lỗi.");
    }
  }
);

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProfile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
      });
  },
});

export const { setUserProfile } = userProfileSlice.actions;

export default userProfileSlice.reducer;
