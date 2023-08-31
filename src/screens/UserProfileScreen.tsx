import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAppBar from "../components/CustomAppBar";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { genAccessToken, getUserProfile } from "../api/endpoints";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import {
  clearUser,
  selectUser,
  setUser,
} from "../store/redux/features/auth/authSlice";
import AlertSessionExpired from "../components/AlertSessionExpired";

const UserProfileScreen = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<null | UserProfileProps>(null);
  const user = useAppSelector<any>(selectUser);
  useEffect(() => {
    fetchUserProfile();
  }, []);
  const fetchUserProfile = async () => {
    await getUserProfile(
      {
        in_uid: user.uid,
        in_accept_code: user.accessToken,
        in_refresh_code: user.refreshToken,
      },
      user.accessToken
    )
      .then((result) => {
        console.log(result.data[0], " << result");
        if (result.status === 200 && result.detail === "SUCCESS") {
          console.log("setUserProfile 1");
          setUserProfile(result.data[0]);
        }
      })
      .catch((error) => {
        console.error(
          error.response.data,
          " << error (fetchUserProfile - [ UserProfileScreen.tsx ])"
        );
        if (
          error.response.status === 401 &&
          error.response.data.detail === "ACCEPT token has expired."
        ) {
          genAccessToken({
            in_uid: user.uid,
            in_accept_code: user.accessToken,
            in_refresh_code: user.refreshToken,
          })
            .then(async (genAccessTokenResult) => {
              console.log(genAccessTokenResult, "<< genAccessTokenResult!");
              if (
                genAccessTokenResult.status === 200 &&
                genAccessTokenResult.detail === "SUCCESS"
              ) {
                dispatch(
                  setUser({
                    uid: genAccessTokenResult.UID,
                    accessToken: genAccessTokenResult.accetp_code,
                    refreshToken: genAccessTokenResult.refresh_code,
                  })
                );
                // console.log(user, "before +++ getNewsContentResult");
                const getUserProfileResult = await getUserProfile(
                  {
                    in_uid: genAccessTokenResult.UID,
                    in_accept_code: genAccessTokenResult.accetp_code,
                    in_refresh_code: genAccessTokenResult.refresh_code,
                  },
                  genAccessTokenResult.accetp_code
                );
                console.log(
                  getUserProfileResult,
                  "\n getUserProfileResult *[NEW]* \n"
                );
                if (
                  getUserProfileResult.status === 200 &&
                  getUserProfileResult.detail === "SUCCESS"
                ) {
                  setUserProfile(getUserProfileResult.data[0]);
                }
              }
            })
            .catch((error) => {
              console.error(error.response, "<< error - genAccessToken");
              if (
                (error.response.status === 401 &&
                  error.response.data.detail === "ACCEPT token has expired.") ||
                (error.response.status === 401 &&
                  error.response.data.detail === "REFRESH token has expired.")
              ) {
                dispatch(clearUser());
                AlertSessionExpired();
              }
            });
        } else if (
          error.response.status === 401 &&
          error.response.data.detail === "REFRESH token has expired."
        ) {
          dispatch(clearUser());
          AlertSessionExpired();
        }
      });
    setIsLoading(false);
  };
  return (
    <SafeAreaView className="flex-1 bg-yellow-500" edges={["top"]}>
      <CustomAppBar headerText={"ข้อมูลผู้ใช้งาน"} menu={true} />
      <View className="flex-1 bg-white">
        {isLoading ? (
          <View className="flex flex-1 justify-center">
            <ActivityIndicator size="large" color="#FDA40F" />
            <Text className="text-[#FDA40F] text-center mt-2 font-semibold">
              ดาวน์โหลดข้อมูลผู้ใช้...
            </Text>
          </View>
        ) : (
          userProfile && (
            <>
              <Image
                source={
                  userProfile.file_image && userProfile.file_image !== "None"
                    ? { uri: userProfile.file_image }
                    : require("../assets/images/profile-picture-default.png")
                }
                className="h-[200px] w-[200px] rounded-full self-center mt-10 mb-5"
              />
              <View className="px-[50]">
                <View className="border-b-2 border-gray-100 py-3">
                  <Text className="font-semibold text-[15px] mb-2 text-gray-400">
                    ชื่อผู้ใช้
                  </Text>
                  <Text className="text-[22px]">{userProfile.user_name}</Text>
                </View>
                <View className="border-b-2 border-gray-100 py-3">
                  <Text className="font-semibold text-[15px] mb-2 text-gray-400">
                    ชื่อ-สกุล
                  </Text>
                  <Text className="text-[22px]">
                    {userProfile.user_fullname}
                  </Text>
                </View>
                <View className="border-b-2 border-gray-100 py-3">
                  <Text className="font-semibold text-[15px] mb-2 text-gray-400">
                    โค๊ตผู้ใช้
                  </Text>
                  <Text className="text-[22px]">{userProfile.user_code}</Text>
                </View>
                <View className="border-b-2 border-gray-100 py-3">
                  <Text className="font-semibold text-[15px] mb-2 text-gray-400">
                    บริษัท
                  </Text>
                  <Text className="text-[22px]">
                    {userProfile.company_name}
                  </Text>
                </View>
              </View>
            </>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default UserProfileScreen;
