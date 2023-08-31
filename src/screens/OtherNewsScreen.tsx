import { ActivityIndicator, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAppBar from "../components/CustomAppBar";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import {
  clearUser,
  selectUser,
  setUser,
} from "../store/redux/features/auth/authSlice";
import { genAccessToken, getNewsHeadlines } from "../api/endpoints";
import { ScrollView } from "react-native-gesture-handler";
import AlertSessionExpired from "../components/AlertSessionExpired";
import OtherNewsCard from "../components/OtherNewsCard";

const OtherNewsScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector<any>(selectUser);
  const [otherNewsList, setOtherNewsList] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    fetchOtherNewsHandler();
  }, []);
  const fetchOtherNewsHandler = async () => {
    await getNewsHeadlines(
      {
        in_uid: user.uid,
        in_accept_code: user.accessToken,
        in_refresh_code: user.refreshToken,
      },
      user.accessToken
    )
      .then((getNewsHeadlinesResult) => {
        console.log(getNewsHeadlinesResult, " << getNewsHeadlinesResult");
        if (
          getNewsHeadlinesResult.status === 200 &&
          getNewsHeadlinesResult.detail === "SUCCESS"
        ) {
          console.log("setOtherNewsList => 01");
          setOtherNewsList(getNewsHeadlinesResult.data);
        }
      })
      .catch((error) => {
        console.error(
          error.response,
          " << error (fetchNewsHandler - [OtherNewsHandler.tsx])"
        );
        if (
          error.response.status === 401 &&
          error.response.data.detail === "ACCEPT token has expired."
        ) {
          console.log("yee");

          genAccessToken({
            in_uid: user.uid,
            in_accept_code: user.accessToken,
            in_refresh_code: user.refreshToken,
          })
            .then(async (genAccessTokenResult) => {
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
                const getNewsHeadlinesResult = await getNewsHeadlines(
                  {
                    in_uid: genAccessTokenResult.UID,
                    in_accept_code: genAccessTokenResult.accetp_code,
                    in_refresh_code: genAccessTokenResult.refresh_code,
                  },
                  genAccessTokenResult.accetp_code
                );
                console.log(
                  getNewsHeadlinesResult,
                  "\n getNewsHeadlinesResult *[NEW]* \n"
                );
                if (
                  getNewsHeadlinesResult.status === 200 &&
                  getNewsHeadlinesResult.detail === "SUCCESS"
                ) {
                  setOtherNewsList(getNewsHeadlinesResult.data);
                }
              }
            })
            .catch((error) => {
              console.error(
                error.response,
                "<< error-genAccessToken[OtherNewsHandler.tsx])"
              );
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
      <CustomAppBar headerText={"ข่าวสาร"} goBack={true} />
      <View className="flex-1 bg-white b-3">
        {isLoading ? (
          <View className="flex flex-1 justify-center">
            <ActivityIndicator size="large" color="#FDA40F" />
            <Text className="text-[#FDA40F] text-center mt-2 font-semibold">
              ดาวน์โหลดข่าว...
            </Text>
          </View>
        ) : (
          otherNewsList.length > 0 && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 15,
                paddingBottom: 30,
              }}
            >
              <View className="flex-row justify-between flex-wrap">
                {otherNewsList.map((item: any, index: number) => {
                  console.log(item, " item");
                  return <OtherNewsCard item={item} key={index} />;
                })}
              </View>
            </ScrollView>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default OtherNewsScreen;
