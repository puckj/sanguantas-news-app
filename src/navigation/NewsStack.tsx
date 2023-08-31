import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NewsScreen from "../screens/NewsScreen";
import OtherNewsScreen from "../screens/OtherNewsScreen";
import { NewsStackParamList } from "./@types";
import NewsDetailScreen from "../screens/NewsDetailScreen";

const Stack = createNativeStackNavigator<NewsStackParamList>();

const NewsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="NewsScreen"
    >
      <Stack.Screen name="NewsScreen" component={NewsScreen} />
      <Stack.Screen name="OtherNewsScreen" component={OtherNewsScreen} />
      <Stack.Screen name="NewsDetailScreen" component={NewsDetailScreen} />
    </Stack.Navigator>
  );
};

export default NewsStack;
