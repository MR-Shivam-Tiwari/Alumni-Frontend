import { combineReducers } from "@reduxjs/toolkit";
import { userReducer } from "./userSlice";
import { postsReducer } from "./postsSlice";
import { settingsReducer } from "./settingsSlice";
import { profileReducer } from "./profileSlice";
import { memberReducer } from "./membersSlice";
import { webSocketReducer } from "./webSocketSlice";

const rootReducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
  settings: settingsReducer,
  profile: profileReducer,
  member: memberReducer,
  webSocket: webSocketReducer,
});

export default rootReducer;