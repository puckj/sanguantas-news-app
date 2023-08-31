import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "../components/CustomDrawer";
import NewsStack from "./NewsStack";
import UserProfileScreen from "../screens/UserProfileScreen";

const Drawer = createDrawerNavigator();

const RootDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        swipeEnabled:false,
        drawerStyle: {
          width: 220,
        },
        drawerLabelStyle: {
          fontSize: 16,
        },
        drawerActiveBackgroundColor: "#FDA40F",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
      }}
    >
      <Drawer.Screen
        component={NewsStack}
        name="NewsStack"
        options={{ drawerLabel: "ข่าวสาร" }}
      />
      <Drawer.Screen
        component={UserProfileScreen}
        name="UserProfileScreen"
        options={{ drawerLabel: "ข้อมูลผู้ใช้งาน" }}
      />
    </Drawer.Navigator>
  );
};

export default RootDrawer;
