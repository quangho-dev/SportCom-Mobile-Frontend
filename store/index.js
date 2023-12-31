import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "../features/userProfile/userProfileSlice";
import userReducer from "../features/user/userSlice";
import teamReducer from "../features/team/teamSlice";
import authReducer from "../features/auth/authSlice";
import meetingReducer from "../features/meeting/meetingSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    userProfile: userProfileReducer,
    team: teamReducer,
    auth: authReducer,
    meeting: meetingReducer,
  },
});
