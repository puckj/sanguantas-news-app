import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import RootStack from "./navigation/RootStack";
import { Provider } from "react-redux";
import { store } from "./store/redux/store";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Selector selectUser returned a different result when called with the same parameters.",
]);

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </Provider>
  );
}

registerRootComponent(App);
