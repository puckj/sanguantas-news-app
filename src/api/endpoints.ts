import { Encryption } from "../helpers/encryption";
import { POST } from "./axios";

export const login = async (iLogin: ILogin) => {
  const encryptedPassword = await Encryption(iLogin.in_password);
  const body = {
    in_username: iLogin.in_username,
    in_password: encryptedPassword.toUpperCase(),
  };
  return POST("/log_in", body);
};

export const logout = async (iLogout: ILogout) => {
  return POST("/log_out", iLogout);
};

export const genAccessToken = async (iGenAccessToken: IGenAccessToken) => {
  return POST("/gen_accept_token", iGenAccessToken);
};

export const getNewsFlash = async (
  iGetNewsFlash: IGetNewsFlash,
  accessToken: string
) => {
  return POST("/get_news_flash", iGetNewsFlash, accessToken);
};

export const getNewsHeadlines = async (
  iGetNewsHeadlines: IGetNewsHeadlines,
  accessToken: string
) => {
  return POST("/get_news_headlines", iGetNewsHeadlines, accessToken);
};

export const getNewsContent = async (
  iGetNewsContent: IGetNewsContent,
  accessToken: string
) => {
  return POST("/get_news_content", iGetNewsContent, accessToken);
};

export const getUserProfile = async (
  iGetUserProfile: IGetUserProfile,
  accessToken: string
) => {
  return POST("/get_user_profile", iGetUserProfile, accessToken);
};
