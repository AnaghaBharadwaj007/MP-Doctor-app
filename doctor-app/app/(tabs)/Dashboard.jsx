import { Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-white">
      <Text className="font-bold">This is index page</Text>
    </SafeAreaView>
  );
}
