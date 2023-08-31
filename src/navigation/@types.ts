import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  RootDrawer: undefined;
  AuthStack: undefined;
};

export type AuthStackParamList = {
  LoginScreen: undefined;
};

export type NewsStackParamList = {
  NewsScreen: undefined;
  OtherNewsScreen: undefined;
  NewsDetailScreen: { newsId: number };
};

export type NewsStackNavigationProp = NativeStackNavigationProp<
  NewsStackParamList,
  keyof NewsStackParamList
>;

export type NewsDetailScreenRouteProp = RouteProp<
  NewsStackParamList,
  "NewsDetailScreen"
>;
