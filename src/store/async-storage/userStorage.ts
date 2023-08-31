import AsyncStorage from "@react-native-async-storage/async-storage";

class userStorages {
  async setUser(uid: string, accessToken: string, refreshToken: string) {
    await AsyncStorage.setItem("@u_id", uid);
    await AsyncStorage.setItem("@u_access", accessToken);
    await AsyncStorage.setItem("@u_refresh", refreshToken);
    return true;
  }
  async getUser() {
    const uid = await AsyncStorage.getItem("@u_id");
    const accessToken = await AsyncStorage.getItem("@u_access");
    const refreshToken = await AsyncStorage.getItem("@u_refresh");
    return { uid, accessToken, refreshToken };
  }
  async clearUser() {
    await AsyncStorage.removeItem("@u_id");
    await AsyncStorage.removeItem("@u_access");
    await AsyncStorage.removeItem("@u_refresh");
    return true;
  }
}

const userStorage = new userStorages();
export default userStorage;
