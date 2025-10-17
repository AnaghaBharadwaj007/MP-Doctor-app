import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import GaitAnalysisCircle from "../GaitAnalysisCircle";
import TremorFrequencyCircle from "../TremorFrequencyCircle";

export default function PatientProfile() {
  const { id: patientId } = useLocalSearchParams();
  const router = useRouter();

  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState(0);
  const [tremorFrequency, setTremorFrequency] = useState(0);
  const [gaitAnalysis, setGaitAnalysis] = useState(0);

  useEffect(() => {
    async function fetchPatientDetails() {
      try {
        if (!patientId) throw new Error("No patient ID provided");
        const response = await fetch(
          `https://heimdall-server.servehttp.com:8443/patient/${patientId}`
        );
        if (!response.ok) throw new Error("Failed to fetch patient details");
        const data = await response.json();

        setPatientName(data.name || "Unknown");
        if (data.dateOfBirth) {
          const birthYear = new Date(data.dateOfBirth).getFullYear();
          const currentYear = new Date().getFullYear();
          setPatientAge(currentYear - birthYear);
        } else {
          setPatientAge(0);
        }

        // Using placeholders for these metrics
        setTremorFrequency(6.2);
        setGaitAnalysis(85);
      } catch (err) {
        Alert.alert("Error", err.message);
      }
    }
    fetchPatientDetails();
  }, [patientId]);

  const handleMoreDetails = () => {
    router.push(`/History/${patientId}`);
  };

  const handlePrescribeMedicine = () => {
    router.push(`/Medication/${patientId}`);
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

        {/* Animated Circles for Tremor and Gait */}
        <View className="mt-6 flex-row items-center justify-center space-x-8">
          <TremorFrequencyCircle value={tremorFrequency} threshold={7} />
          <GaitAnalysisCircle value={gaitAnalysis} threshold={80} />
        </View>

        {/* Monitoring Status */}
        <View className="mt-10">
          <Text className="text-white text-2xl font-bold">Current Status</Text>
          <View className="mt-4 flex-row justify-between">
            <View className="p-4 bg-gray-800 rounded-lg w-[48%] items-center">
              <Text className="text-green-500 font-bold text-3xl">
                {tremorFrequency} Hz
              </Text>
              <Text className="text-gray-400 mt-2 text-sm">
                Tremor Frequency
              </Text>
            </View>
            <View className="p-4 bg-gray-800 rounded-lg w-[48%] items-center">
              <Text className="text-green-500 font-bold text-3xl">
                {gaitAnalysis}%
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
