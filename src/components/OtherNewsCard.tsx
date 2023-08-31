import { View, Text, Dimensions, Image } from "react-native";
import React, { useCallback, useState } from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import formatTime from "../helpers/formattedDate";
import { useNavigation } from "@react-navigation/native";
import { NewsStackNavigationProp } from "../navigation/@types";

const { width, height } = Dimensions.get("window");

const OtherNewsCard = ({ item }: OtherNewsCardItemProps) => {
  const navigation = useNavigation<NewsStackNavigationProp>();
  const [isLengthMore, setIsLengthMore] = useState<boolean>(false);
  const maxLength = 3;
  const onTextLayout = useCallback(
    (e: { nativeEvent: { lines: string | any[] } }) => {
      setIsLengthMore(e.nativeEvent.lines.length >= maxLength); //เช็คว่าเกิน 10 บรรทัดหรือป่าว
    },
    []
  );

  return (
    <TouchableWithoutFeedback
      className="mt-3"
      style={{ width: width * 0.45 }}
      onPress={() =>
        navigation.navigate("NewsDetailScreen", { newsId: item.news_id })
      }
    >
      <Image
        source={
          item.news_image
            ? { uri: item.news_image[0].news_image_data }
            : require("../assets/images/news-picture-default.jpeg")
        }
        style={{
          width: width * 0.45,
          height: height * 0.25,
          alignSelf: "center",
          resizeMode: "cover",
        }}
      />
      <View className="absolute top-0 right-0 py-0.5 px-1 m-1 bg-[#2c2c2cc4] rounded-sm">
        <Text className="text-[11px] text-neutral-100">
          {formatTime(item.time)}
        </Text>
      </View>
      <View className="absolute bottom-0 bg-[#2c2c2ce1] w-full p-2.5">
        <Text
          className=" text-neutral-100"
          onTextLayout={onTextLayout}
          numberOfLines={isLengthMore ? maxLength : undefined}
        >
          {item.headlines}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OtherNewsCard;
