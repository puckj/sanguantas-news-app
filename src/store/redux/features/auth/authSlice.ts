import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import userStorage from "../../../async-storage/userStorage";

const initialState: AuthState = {
  isAuthenticated: false,
  uid: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUserPayload>) => {
      const { uid, accessToken, refreshToken } = action.payload;
      state.isAuthenticated = true;
      state.uid = uid;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      userStorage.setUser(uid, accessToken, refreshToken);
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.uid = null;
      state.accessToken = null;
      state.refreshToken = null;
      userStorage.clearUser();
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export const selectIsAuth = (state: RootState) => {
  return state.auth.isAuthenticated;
};

export const selectUser = createSelector(
  (state: RootState) => state.auth,
  (auth) => ({
    uid: auth.uid,
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
  })
);

export default authSlice.reducer;
