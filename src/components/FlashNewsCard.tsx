import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useCallback, useState } from "react";
import formattedDate from "../helpers/formattedDate";
import { useNavigation } from "@react-navigation/native";
import { NewsStackNavigationProp } from "../navigation/@types";

const { width, height } = Dimensions.get("window");

const FlashNewsCard = ({ item }: any) => {
  const navigation = useNavigation<NewsStackNavigationProp>();
  const [isLengthMoreHeader, setIsLengthMoreHeader] = useState<boolean>(false);
  const [isLengthMoreData, setIsLengthMoreData] = useState<boolean>(false);
  const maxLength = {
    header: 4,
    data: 10,
  };

  const onTextLayoutNewsHeader = useCallback(
    (e: { nativeEvent: { lines: string | any[] } }) => {
      setIsLengthMoreHeader(e.nativeEvent.lines.length >= maxLength.header); //เช็คว่าเกิน 4 บรรทัดหรือป่าว
    },
    []
  );

  const onTextLayoutNewsData = useCallback(
    (e: { nativeEvent: { lines: string | any[] } }) => {
      setIsLengthMoreData(e.nativeEvent.lines.length >= maxLength.data); //เช็คว่าเกิน 10 บรรทัดหรือป่าว
    },
    []
  );

  return (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("NewsDetailScreen", { newsId: item.news_id })
      }
    >
      <View className="bg-gray-50 border-[1px] border-gray-300 rounded-2xl">
        <View>
          <Image
            source={
              item.news_image
                ? { uri: item.news_image[0].news_image_data }
                : require("../assets/images/news-picture-default.jpeg")
            }
            style={{
              width: width * 0.78,
              height: height * 0.25,
              alignSelf: "center",
            }}
            className=" rounded-t-2xl"
          />
          <View className="absolute left-0 bottom-0 bg-[#fda60fb7] py-0.5 px-1.5 rounded-tr-lg">
            <Text className=" text-[12px] text-white font-semibold">
              {formattedDate(item.time)}
            </Text>
          </View>
        </View>
        <View className="px-5 pt-4 pb-6">
          <Text
            className="text-[22px] font-bold mb-2"
            onTextLayout={onTextLayoutNewsHeader}
            numberOfLines={isLengthMoreHeader ? 4 : undefined}
          >
            {item.news_headlines}
          </Text>
          <Text
            onTextLayout={onTextLayoutNewsData}
            numberOfLines={isLengthMoreData ? 10 : undefined}
          >
            {item.news_data}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FlashNewsCard;
