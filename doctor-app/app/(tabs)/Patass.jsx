import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Helper to decode JWT payload for doctor ID
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function TabTwoScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Call backend to create patient and send mail (button click handler)
  const sendOtpEmail = async () => {
    try {
      const token = await SecureStore.getItemAsync("doctor_jwt");
      if (!token) throw new Error("Doctor authentication missing");
      const payload = parseJwt(token);
      if (!payload || !payload.sub) throw new Error("Invalid token");

      const doctorId = payload.sub;
      const response = await fetch(
        `https://heimdall-server.servehttp.com:8443/doctor/${doctorId}/create-patient`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send invite. Please double-check inputs.");
      }

      const result = await response.json();
      Alert.alert(
        "Patient Created",
        `Patient email: ${result.email}\nA signup mail has been sent!`
      );
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const handleSubmit = () => {
    sendOtpEmail();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="p-5">
        <Text className="text-white text-3xl font-bold mb-6 text-center">
          Enter patient Details
        </Text>
        <View className="mb-5">
          <Text className="text-white mb-2">Name</Text>
          <TextInput
            className="bg-gray-800 p-4 rounded-lg text-white"
            placeholder="Enter patient name"
            placeholderTextColor="#a1a1aa"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-7">
          <Text className="text-white mb-2">Email</Text>
          <TextInput
            className="bg-gray-800 p-4 rounded-lg text-white"
            placeholder="Enter patient email"
            placeholderTextColor="#a1a1aa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity
          className="bg-green-500 p-5 rounded-full"
          onPress={handleSubmit}
        >
          <Text className="text-black font-bold text-center text-lg">
            Send OTP
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
