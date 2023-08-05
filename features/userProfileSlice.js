import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profile: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
});

export const selectProfile = (state) => state.userProfile.profile;

export default profileSlice.reducer;
