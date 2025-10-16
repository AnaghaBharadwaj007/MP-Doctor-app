import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DoctorSignupScreen() {
  const router = useRouter();

  // Update state fields as per API requirements
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      // Basic validation (optional, add more later)
      if (!name || !email || !phone || !specialization || !password) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }

      const response = await fetch(
        "https://heimdall-server.servehttp.com:8443/doctor/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            specialization,
            password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      Alert.alert("Success", "Account created successfully");
      router.push("/(tabs)/Dashboard"); // Redirect to doctor's dashboard
    } catch (error) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google Sign Up button pressed.");
  };

  const goToSignin = () => {
    router.push("/Signin");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#101013]">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 justify-between">
          <View>
            <Text className="text-4xl font-extrabold text-white mt-12 mb-4">
              Join Our Community
            </Text>
            <Text className="text-lg text-gray-400 mb-8">
              Create an account to begin your journey.
            </Text>

            <TextInput
              className="w-full px-4 py-3 bg-[#181B1F] rounded-lg text-white mb-4"
              placeholder="Full Name"
              placeholderTextColor="#656ca9"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              className="w-full px-4 py-3 bg-[#181B1F] rounded-lg text-white mb-4"
              placeholder="Email"
              placeholderTextColor="#656ca9"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              className="w-full px-4 py-3 bg-[#181B1F] rounded-lg text-white mb-4"
              placeholder="Phone Number"
              placeholderTextColor="#656ca9"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <TextInput
              className="w-full px-4 py-3 bg-[#181B1F] rounded-lg text-white mb-4"
              placeholder="Specialization"
              placeholderTextColor="#656ca9"
              value={specialization}
              onChangeText={setSpecialization}
            />

            <TextInput
              className="w-full px-4 py-3 bg-[#181B1F] rounded-lg text-white mb-4"
              placeholder="Password"
              placeholderTextColor="#656ca9"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              className="w-full px-4 py-4 bg-green-500 rounded-full mt-8 shadow-lg shadow-green-400"
              onPress={handleSignUp}
            >
              <Text className="text-center text-[#101013] text-lg font-bold">
                Sign Up
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-8">
              <View className="flex-1 h-[1px] bg-gray-600" />
              <Text className="text-gray-400 px-4">OR</Text>
              <View className="flex-1 h-[1px] bg-gray-600" />
            </View>

            <TouchableOpacity
              className="flex-row items-center justify-center p-3 rounded-full border border-gray-600"
              onPress={handleGoogleSignUp}
            >
              <Ionicons name="logo-google" size={24} color="#fff" />
              <Text className="text-white ml-2">Continue with Google</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mb-8">
            <Text className="text-gray-400">Already have an account? </Text>
            <TouchableOpacity onPress={goToSignin}>
              <Text className="text-green-400 font-semibold">Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
