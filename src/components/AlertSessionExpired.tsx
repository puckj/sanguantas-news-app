import { Alert } from "react-native";
export default function AlertSessionExpired() {
  return Alert.alert(
    "มีบางอย่างผิดพลาด!",
    "เซสชั่นของคุณหมดอายุแล้ว...",
    [
      {
        text: "OK",
        style: "cancel",
      },
    ],
    { cancelable: false }
  );
}
