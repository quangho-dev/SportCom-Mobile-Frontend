import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "./features/userProfileSlice";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
  },
});
