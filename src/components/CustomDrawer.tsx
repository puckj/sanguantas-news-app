import { View, Text, TouchableOpacity, Alert } from "react-native";
import { DrawerItemList } from "@react-navigation/drawer";
import { useAppDispatch } from "../store/redux/hooks";
import { useSelector } from "react-redux";
import { logout } from "../api/endpoints";
import { clearUser } from "../store/redux/features/auth/authSlice";
import { MaterialIcons } from "@expo/vector-icons";

const CustomDrawer = (props: any) => {
  const dispatch = useAppDispatch();
  const uid = useSelector((state: any) => state.auth.uid);
  const logoutHandle = async () => {
    Alert.alert(
      "ออกจากระบบ",
      "คุณต้องการที่จะออกจากระบบหรือไม่?",
      [
        {
          text: "ไม่",
          style: "cancel",
        },
        {
          text: "ใช่",
          onPress: async () => {
            await logout({ in_uid: uid });
            dispatch(clearUser());
          },
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <View className="flex-1">
      <View className="flex-[6] pt-12">
        <DrawerItemList {...props} />
      </View>
      <View className="flex-1 pl-4 pt-4">
        <TouchableOpacity className="flex-row" onPress={logoutHandle}>
          <MaterialIcons name="logout" size={24} color="black" />
          <Text className=" text-[16px] ml-1 font-semibold">ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
