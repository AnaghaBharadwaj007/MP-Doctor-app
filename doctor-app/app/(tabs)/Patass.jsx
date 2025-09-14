import { Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  return (
    <SafeAreaView className="bg-amber-200">
      <Text className="text-center pt-10 font-bold text-white">
        This is explore page.
      </Text>
    </SafeAreaView>
  );
}
