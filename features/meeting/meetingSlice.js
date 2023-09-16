import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "@env";
import Toast from "react-native-toast-message";

const initialState = {
  meeting: null,
  meetings: [],
  isLoading: false,
  error: null,
};

const url = `${BASE_URL}/api/meeting`;

export const createMeeting = createAsyncThunk(
  "meeting/createMeeting",
  async (data, thunkAPI) => {
    const { auth } = thunkAPI.getState();
    try {
      const resp = await axios.post(`${url}/create-meeting-v2`, data, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      });

      return resp.data;
    } catch (error) {
      console.log("error:", error);
      return thunkAPI.rejectWithValue("Xin lỗi, đã xảy ra lỗi.");
    }
  }
);

const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    setMeetings: (state, action) => {
      state.meetings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMeeting.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("action.payload:", action.payload);
        state.meetings = [action.payload, ...state.meetings];

        Toast.show({
          type: "success",
          text1: "Tạo buổi chơi mới thành công!",
        });
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;

        Toast.show({
          type: "error",
          text1: "Xin lỗi, đã xảy ra lỗi :(",
        });
      });
  },
});

export const { setMeetings } = meetingSlice.actions;

export default meetingSlice.reducer;
