import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "@env";
import Toast from "react-native-toast-message";

const initialState = {
  meeting: null,
  meetings: [],
  isLoading: false,
  error: null,
  meetingsBelongToUser: [],
};

const url = `${BASE_URL}/api/meeting`;

export const createMeeting = createAsyncThunk(
  "meeting/createMeeting",
  async (data, thunkAPI) => {
    console.log("create meeting");
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

export const updateMeeting = createAsyncThunk(
  "meeting/updateMeeting",
  async (data, thunkAPI) => {
    console.log("update meeting");
    const { auth } = thunkAPI.getState();
    try {
      const resp = await axios.put(`${BASE_URL}/api/meeting/${data.id}`, data, {
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

export const fetchMeetingsBelongToUser = createAsyncThunk(
  "meeting/fetchMeetingsBelongToUser",
  async (data, thunkAPI) => {
    console.log("fetching meetings belong to user...");
    const { auth } = thunkAPI.getState();
    try {
      const resp = await axios.get(`${BASE_URL}/api/meeting/me`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      return resp.data;
    } catch (error) {
      console.log("error:", error.response);
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
          text1: "Xin lỗi, đã xảy ra lỗi",
        });
      })
      .addCase(fetchMeetingsBelongToUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMeetingsBelongToUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meetingsBelongToUser = action.payload;
      })
      .addCase(fetchMeetingsBelongToUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.meetingsBelongToUser = [];

        Toast.show({
          type: "error",
          text1: "Xin lỗi, đã xảy ra lỗi",
        });
      })
      .addCase(updateMeeting.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMeeting.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meetings = state.meetings.map((meeting) =>
          meeting.id === action.payload.id ? action.payload : meeting
        );

        Toast.show({
          type: "success",
          text1: "Chỉnh sửa buổi chơi thành công!",
        });
      })
      .addCase(updateMeeting.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;

        Toast.show({
          type: "error",
          text1: "Xin lỗi, đã xảy ra lỗi",
        });
      });
  },
});

export const { setMeetings } = meetingSlice.actions;

export default meetingSlice.reducer;
