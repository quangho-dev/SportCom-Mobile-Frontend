import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "../features/userProfile/userProfileSlice";
import userReducer from "../features/user/userSlice";
import teamReducer from "../features/team/teamSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    userProfile: userProfileReducer,
    team: teamReducer,
  },
});
