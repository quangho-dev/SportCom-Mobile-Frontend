import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "@env";

const initialState = {
  team: null,
  teams: [],
  isLoading: true,
};

const url = `${BASE_URL}/api/team`;

export const getTeams = createAsyncThunk(
  "user/getTeams",
  async (token, thunkAPI) => {
    try {
      const resp = await axios(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Xin lỗi, đã xảy ra lỗi.");
    }
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTeams.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams = action.payload;
      })
      .addCase(getTeams.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
      });
  },
});

// export const { getTeams } = teamSlice.actions;

export default teamSlice.reducer;
