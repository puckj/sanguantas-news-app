import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  NewsDetailScreenRouteProp,
  NewsStackNavigationProp,
} from "../navigation/@types";
import { genAccessToken, getNewsContent } from "../api/endpoints";
import {
  clearUser,
  selectUser,
  setUser,
} from "../store/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import AlertSessionExpired from "../components/AlertSessionExpired";
import { Ionicons } from "@expo/vector-icons";
import formatTime from "../helpers/formattedDate";

const { width, height } = Dimensions.get("window");

const NewsDetailScreen = () => {
  const dispatch = useAppDispatch();
  const { params } = useRoute<NewsDetailScreenRouteProp>();
  const user = useAppSelector<any>(selectUser);
  const navigation = useNavigation<NewsStackNavigationProp>();
  const [newsContent, setNewsContent] = useState<null | NewsContentProps>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    // console.log(params, " NewsDetailScreen+++///");
    fetchNewsContentData();
  }, []);
  const fetchNewsContentData = async () => {
    await getNewsContent(
      {
        in_uid: user.uid,
        in_accept_code: user.accessToken,
        in_refresh_code: user.refreshToken,
        in_news_id: params.newsId,
      },
      user.accessToken
    )
      .then((result) => {
        console.log(result.data[0], " << result");
        if (result.status === 200 && result.detail === "SUCCESS") {
          console.log("setNewsList 1");
          setNewsContent(result.data[0]);
        }
      })
      .catch((error) => {
        console.error(
          error.response.data,
          " << error (fetchNewsContentData - [ NewsDetailScreen.tsx ])"
        );

        if (
          error.response.status === 401 &&
          error.response.data.detail === "ACCEPT token has expired."
        ) {
          console.log("yess!");

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
                const getNewsContentResult = await getNewsContent(
                  {
                    in_uid: genAccessTokenResult.UID,
                    in_accept_code: genAccessTokenResult.accetp_code,
                    in_refresh_code: genAccessTokenResult.refresh_code,
                    in_news_id: params.newsId,
                  },
                  genAccessTokenResult.accetp_code
                );
                console.log(
                  getNewsContentResult,
                  "\n getNewsContentResult *[NEW]* \n"
                );
                if (
                  getNewsContentResult.status === 200 &&
                  getNewsContentResult.detail === "SUCCESS"
                ) {
                  setNewsContent(getNewsContentResult.data[0]);
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
    <>
      <TouchableOpacity
        className="absolute p-1.5 z-10 mt-14 ml-4 bg-[#fda60fe5] 
        rounded-tl-3xl rounded-tr-md rounded-br-3xl rounded-bl-md"
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="ios-arrow-back-sharp" size={36} color="#ffffffe5" />
      </TouchableOpacity>
      {isLoading ? (
        <View className="flex flex-1 justify-center">
          <ActivityIndicator size="large" color="#FDA40F" />
          <Text className="text-[#FDA40F] text-center mt-2 font-semibold">
            ดาวน์โหลดข่าว...
          </Text>
        </View>
      ) : (
        <ScrollView>
          {newsContent && (
            <>
              <Image
                source={
                  newsContent.news_image
                    ? { uri: newsContent.news_image[0].news_image_data }
                    : require("../assets/images/news-picture-default.jpeg")
                }
                style={{
                  width: width,
                  height: height * 0.45,
                  alignSelf: "center",
                }}
              />
              <View className="px-7 pt-4 pb-10">
                <Text className="text-[26px] font-semibold">{newsContent.news_headline}</Text>
                <Text className="text-gray-400 font-semibold my-1 text-[13px]">{formatTime(newsContent.time)}</Text>
                <Text className="mt-3 text-[16px]">{newsContent.news_data}</Text>
              </View>
            </>
          )}
        </ScrollView>
      )}
    </>
  );
};

export default NewsDetailScreen;
