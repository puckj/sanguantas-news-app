import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  headerText: string;
  menu?: boolean;
  goBack?: boolean;
};

const CustomAppBar = ({ headerText, menu, goBack }: Props) => {
  const navigation = useNavigation<any>();
  return (
    <View className="flex-row bg-yellow-500 h-20">
      {menu && (
        <TouchableOpacity
          className="h-full justify-center px-4"
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={33} color="#515151" />
        </TouchableOpacity>
      )}
      {goBack && (
        <TouchableOpacity
          className="h-full justify-center px-4"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-sharp" size={33} color="#515151" />
        </TouchableOpacity>
      )}

      <View className="absolute h-full w-full -z-10 justify-center">
        <Text className="text-center text-2xl font-semibold text-[#515151]">
          {headerText}
        </Text>
      </View>
    </View>
  );
};

export default CustomAppBar;
<CustomAppBar headerText={"ข่าวสาร"} />;
