import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RootDrawer from "./RootDrawer";
import AuthStack from "./AuthStack";
import { RootStackParamList } from "./@types";
import userStorage from "../store/async-storage/userStorage";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import { selectIsAuth, setUser } from "../store/redux/features/auth/authSlice";
import OverlayActivityIndicator from "../components/OverlayActivityIndicator";

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStack = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isAuthenticated = useAppSelector(selectIsAuth);
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const userFromStorage = await userStorage.getUser();
    console.log(userFromStorage, " userFromStorage");
    if (
      userFromStorage.uid &&
      userFromStorage.accessToken &&
      userFromStorage.refreshToken
    ) {
      const { uid, accessToken, refreshToken } = userFromStorage;
      dispatch(setUser({ uid, accessToken, refreshToken }));
    }
    setIsLoading(false);
  };

  return isLoading ? (
    <OverlayActivityIndicator visible={true} />
  ) : (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="RootDrawer" component={RootDrawer} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootStack;
