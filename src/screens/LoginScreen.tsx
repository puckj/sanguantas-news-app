import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { genAccessToken, login } from "../api/endpoints";
import { setUser } from "../store/redux/features/auth/authSlice";
import { useAppDispatch } from "../store/redux/hooks";
import OverlayActivityIndicator from "../components/OverlayActivityIndicator";

const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState({ value: "", errorStatus: false });
  const [password, setPassword] = useState({ value: "", errorStatus: false });
  const loginButtonOnPressHandler = async () => {
    setIsLoading(true);
    if (username.value !== "" && password.value !== "") {
      // console.log(username.value.toLocaleLowerCase(), password.value);
      try {
        const loginResult = await login({
          in_username: username.value.toLocaleLowerCase(),
          in_password: password.value,
        });
        console.log(loginResult, " loginResult");
        if (loginResult.status === 200 && loginResult.detail === "SUCCESS") {
          const { UID, accetp_code } = loginResult;
          const genAccessTokenResult = await genAccessToken({
            in_uid: UID,
            in_accept_code: accetp_code,
            in_refresh_code: null,
          });
          if (
            genAccessTokenResult.status === 200 &&
            genAccessTokenResult.detail === "SUCCESS"
          ) {
            const { UID, accetp_code, refresh_code } = genAccessTokenResult;
            console.log(
              UID,
              accetp_code,
              refresh_code,
              " genAccessTokenResult"
            );
            dispatch(
              setUser({
                uid: UID,
                accessToken: accetp_code,
                refreshToken: refresh_code,
              })
            );
          }
        } else {
          console.error(
            "Something went wrong... // loginInHandle() ",
            loginResult
          );
        }
      } catch (error: any) {
        // console.error(error.response);
        if (
          error.message === "Network Error" ||
          error.message === "timeout exceeded"
        ) {
          Alert.alert(
            "มีบางอย่างผิดพลาด!",
            "การเชื่อมต่อผิดพลาด",
            [{ text: "OK", style: "cancel" }],
            { cancelable: false }
          );
        }
        if (
          error.response &&
          error.response.status === 403 &&
          error.response.data.detail === "Invalid user."
        ) {
          Alert.alert(
            "เข้าสู่ระบบไม่สำเร็จ...",
            "กรุณากรอกชื่อผู้ใช้งาน หรือรหัสผ่านที่ถูกต้อง",
            [{ text: "OK", style: "cancel" }],
            { cancelable: false }
          );
        }
      }
    } else {
      if (username.value === "") {
        setUsername({ value: "", errorStatus: true });
      }
      if (password.value === "") {
        setPassword({ value: "", errorStatus: true });
      }
    }
    setIsLoading(false);
  };
  return (
    <>
      <SafeAreaView className="flex-1 bg-yellow-500" edges={["top"]}>
        <View className="bg-yellow-500 h-[100px]" />
        <View className="bg-white h-full px-12">
          <Text className="font-bold text-4xl mt-16 mb-10">เข้าสู่ระบบ</Text>
          <View
            className={`bg-neutral-100 rounded-lg flex-row p-3 border ${
              username.errorStatus ? "border-red-300" : "border-neutral-100"
            }`}
          >
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              color="black"
            />
            <TextInput
              className="pl-3 pr-5 text-[17px] w-full"
              placeholder="ผู้ใช้งาน"
              value={username.value}
              onChangeText={(text) =>
                setUsername({ value: text, errorStatus: false })
              }
            />
          </View>
          <View
            className={`bg-neutral-100 rounded-lg flex-row p-3 mt-7 border ${
              password.errorStatus ? "border-red-300" : "border-neutral-100"
            }`}
          >
            <MaterialCommunityIcons
              name="key-outline"
              size={24}
              color="black"
            />
            <TextInput
              className="pl-3 pr-5 text-[17px] w-full"
              placeholder="รหัสผ่าน"
              secureTextEntry
              value={password.value}
              onChangeText={(text) =>
                setPassword({ value: text, errorStatus: false })
              }
            />
          </View>
          <TouchableOpacity
            className="bg-yellow-500 p-3 rounded-2xl mt-11"
            onPress={loginButtonOnPressHandler}
          >
            <Text className="text-white text-2xl font-semibold text-center">
              เข้าสู่ระบบ
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <OverlayActivityIndicator visible={isLoading} />
    </>
  );
};

export default LoginScreen;
