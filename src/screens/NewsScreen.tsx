import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAppBar from "../components/CustomAppBar";
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { genAccessToken, getNewsFlash } from "../api/endpoints";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import {
  clearUser,
  selectUser,
  setUser,
} from "../store/redux/features/auth/authSlice";
import AlertSessionExpired from "../components/AlertSessionExpired";
import Carousel from "react-native-snap-carousel";
import FlashNewsCard from "../components/FlashNewsCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NewsStackNavigationProp } from "../navigation/@types";

const { width, height } = Dimensions.get("window");

const NewsScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector<any>(selectUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newsList, setNewsList] = useState<[]>([]);
  const navigation = useNavigation<NewsStackNavigationProp>();

  useEffect(() => {
    fetchNewsHandler();
  }, []);
  const fetchNewsHandler = async () => {
    console.log(user, "\n^^**[>> user-01 <<]**^^");
    await getNewsFlash(
      {
        in_uid: user.uid,
        in_accept_code: user.accessToken,
        in_refresh_code: user.refreshToken,
      },
      user.accessToken
    )
      .then((getNewsResult) => {
        // console.log(getNewsResult, " << getNewsResult");
        if (
          getNewsResult.status === 200 &&
          getNewsResult.detail === "SUCCESS"
        ) {
          console.log("setNewsList 1");
          setNewsList(getNewsResult.data);
        }
      })
      .catch((error) => {
        console.error(
          error.response,
          " << error (fetchNewsHandler - [NewsScreen.tsx])"
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
                console.log("\n dispatch NEW ACCESS TOKEN!!! \n");
                dispatch(
                  setUser({
                    uid: genAccessTokenResult.UID,
                    accessToken: genAccessTokenResult.accetp_code,
                    refreshToken: genAccessTokenResult.refresh_code,
                  })
                );
                const getNewsFlashResult = await getNewsFlash(
                  {
                    in_uid: genAccessTokenResult.UID,
                    in_accept_code: genAccessTokenResult.accetp_code,
                    in_refresh_code: genAccessTokenResult.refresh_code,
                  },
                  genAccessTokenResult.accetp_code
                );
                console.log(
                  getNewsFlashResult,
                  "\n getNewsFlashResult *[NEW]* \n"
                );
                if (
                  getNewsFlashResult.status === 200 &&
                  getNewsFlashResult.detail === "SUCCESS"
                ) {
                  setNewsList(getNewsFlashResult.data);
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
      <CustomAppBar headerText={"ข่าวสาร"} menu={true} />
      <View className="flex-1 bg-white">
        {isLoading ? (
          <View className="flex flex-1 justify-center">
            <ActivityIndicator size="large" color="#FDA40F" />
            <Text className="text-[#FDA40F] text-center mt-2 font-semibold">
              ดาวน์โหลดข่าว...
            </Text>
          </View>
        ) : (
          newsList.length > 0 && (
            <>
              <View style={{ height: height * 0.88 }}>
                <TouchableOpacity
                  className="m-3 self-end p-2 flex-row items-center"
                  onPress={() => navigation.navigate("OtherNewsScreen")}
                >
                  <MaterialCommunityIcons
                    name="newspaper-variant-outline"
                    size={18}
                    color="black"
                  />
                  <Text className="ml-1">ดูข่าวสารอื่นๆ</Text>
                </TouchableOpacity>
                <Carousel
                  data={newsList}
                  firstItem={0}
                  renderItem={({ item }) => <FlashNewsCard item={item} />}
                  sliderWidth={width}
                  itemWidth={width * 0.77}
                  inactiveSlideOpacity={0.55}
                  slideStyle={{ display: "flex", alignItems: "center" }}
                />
              </View>
            </>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default NewsScreen;
