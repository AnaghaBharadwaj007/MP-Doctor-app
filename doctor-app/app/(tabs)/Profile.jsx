import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Decode JWT helper
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

export default function Profile() {
  const router = useRouter();

  const [userName, setUserName] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [userRole, setUserRole] = useState("Doctor");

  // On component mount load name and email from decoded JWT or backend
  useEffect(() => {
    async function loadUserData() {
      try {
        const token = await SecureStore.getItemAsync("doctor_jwt");
        if (!token) throw new Error("User not authenticated");
        const payload = parseJwt(token);
        if (!payload) throw new Error("Invalid token");

        // Optionally, you could fetch latest data from backend here

        setUserName(payload.name || "Doctor");
        setEmail(payload.email || "parkinsons@gmail.com");
      } catch (err) {
        Alert.alert("Error", err.message);
      }
    }
    loadUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = await SecureStore.getItemAsync("doctor_jwt");
      if (!token) throw new Error("User not authenticated");
      const payload = parseJwt(token);
      if (!payload || !payload.sub) throw new Error("Invalid token");
      const doctorId = payload.sub;

      // Send only allowed fields to update: name and email
      const body = {
        name: userName,
        phone: "", // Empty or keep as is (not changing)
        specialization: "", // Empty or keep as is (not changing)
      };

      // Make PUT request
      const response = await fetch(
        `https://heimdall-server.servehttp.com:8443/doctor/${doctorId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      Alert.alert("Profile Updated", "Your information has been saved.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Password Change",
      "You will be redirected to the password change screen."
    );
  };

  const handleLogout = () => {
    Alert.alert("Logged Out", "You have successfully logged out.");
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 p-5 pb-24">
        {/* Header with Back Button */}
        <View className="flex-row items-center justify-between mb-6">
          {/* Back button can be uncommented later */}
          <View className="flex-1 ml-4">
            <Text className="text-white text-3xl font-bold">User Profile</Text>
            <Text className="text-gray-400 mt-1">
              View and manage your personal information.
            </Text>
          </View>
        </View>

        {/* Profile Card */}
        <View className="bg-gray-800 p-6 rounded-lg mb-6 items-center">
          <View className="p-4 bg-gray-600 rounded-full mb-4">
            <FontAwesome5 name="user-circle" size={60} color="white" />
          </View>
          <Text className="text-white text-2xl font-bold">{userName}</Text>
          <Text className="text-green-500 text-sm mt-1">{userRole}</Text>
        </View>

        {/* Update Information Form */}
        <View className="bg-gray-800 p-5 rounded-lg mb-6">
          <Text className="text-white text-lg font-bold mb-4">
            Update Information
          </Text>
          <Text className="text-gray-400 mb-2">Full Name</Text>
          <TextInput
            className="bg-gray-700 text-white rounded-md p-3 mb-4"
            value={userName}
            onChangeText={setUserName}
          />
          <Text className="text-gray-400 mb-2">Email Address</Text>
          <TextInput
            className="bg-gray-700 text-white rounded-md p-3 mb-4"
            value={email}
            keyboardType="email-address"
            editable={false} // Make email field non-editable if you want, else remove
          />

          <TouchableOpacity
            className="p-4 bg-green-500 rounded-full"
            onPress={handleUpdate}
          >
            <Text className="text-black text-lg font-bold text-center">
              Update Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Password and Logout Section */}
        <View className="bg-gray-800 p-5 rounded-lg">
          <Text className="text-white text-lg font-bold mb-4">
            Security & Account
          </Text>
          <TouchableOpacity
            className="p-4 bg-gray-700 rounded-lg mb-4"
            onPress={handleChangePassword}
          >
            <Text className="text-white text-center font-bold">
              Change Password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-4 bg-red-500 rounded-full"
            onPress={handleLogout}
          >
            <Text className="text-white text-lg font-bold text-center">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
