import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./@types";
import LoginScreen from "../screens/LoginScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
