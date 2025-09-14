import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatientProfile() {
  const router = useRouter();

  // Placeholder patient data
  const [patientName, setPatientName] = useState("Alice Johnson");
  const [patientAge, setPatientAge] = useState(68);
  const [tremorFrequency, setTremorFrequency] = useState("6.2 Hz");
  const [gaitAnalysis, setGaitAnalysis] = useState("85%");

  const handlePrescribeMedicine = () => {
    // Placeholder for navigation to the medication page
    //Alert.alert("Prescribe Medicine", "Navigating to medication page.");
    // router.push(`/medication/${patientId}`);
    router.push("/Medication");
  };

  const handleMoreDetails = () => {
    // Placeholder for navigation to the patient's history page
    //Alert.alert("More Details", "Navigating to patient's history.");
    // router.push(`/history/${patientId}`);
    router.push("/History");
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 p-5 pb-24">
        {/* Header with Back Button */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back-circle-outline"
              size={32}
              color="white"
            />
          </TouchableOpacity>
          <View className="flex-1 ml-4">
            <Text className="text-white text-3xl font-bold">{patientName}</Text>
            <Text className="text-gray-400 mt-1">{`Age: ${patientAge}, Patient`}</Text>
          </View>
        </View>

        {/* Digital Twin Placeholder */}
        <View className="mt-6 flex items-center justify-center">
          <View
            style={{ height: 250, width: 250 }}
            className="bg-gray-800 rounded-full flex items-center justify-center border border-green-500"
          >
            <Text className="text-white text-lg">Digital Twin</Text>
          </View>
        </View>

        {/* Monitoring Status */}
        <View className="mt-10">
          <Text className="text-white text-2xl font-bold">Current Status</Text>
          <View className="mt-4 flex-row justify-between">
            <View className="p-4 bg-gray-800 rounded-lg w-[48%] items-center">
              <Text className="text-green-500 font-bold text-3xl">
                {tremorFrequency}
              </Text>
              <Text className="text-gray-400 mt-2 text-sm">
                Tremor Frequency
              </Text>
            </View>
            <View className="p-4 bg-gray-800 rounded-lg w-[48%] items-center">
              <Text className="text-green-500 font-bold text-3xl">
                {gaitAnalysis}
              </Text>
              <Text className="text-gray-400 mt-2 text-sm">Gait Analysis</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mt-10">
          <TouchableOpacity
            className="p-5 rounded-full bg-green-500 mb-4"
            onPress={handlePrescribeMedicine}
          >
            <Text className="text-black text-lg font-bold text-center">
              Prescribe Medicine
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-5 rounded-full bg-gray-600"
            onPress={handleMoreDetails}
          >
            <Text className="text-white text-lg font-bold text-center">
              More Details
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
