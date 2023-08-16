import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "../features/userProfile/userProfileSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    userProfile: userProfileReducer,
  },
});
