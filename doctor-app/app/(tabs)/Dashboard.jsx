import { Ionicons } from "@expo/vector-icons";
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

// Helper: decode JWT and extract payload
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

export default function Dashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch patients associated with doctor on mount
  useEffect(() => {
    async function fetchPatients() {
      try {
        const token = await SecureStore.getItemAsync("doctor_jwt");
        if (!token) throw new Error("User not authenticated");
        const payload = parseJwt(token);
        if (!payload || !payload.sub) throw new Error("Invalid token");
        const doctorId = payload.sub;

        const response = await fetch(
          `https://heimdall-server.servehttp.com:8443/doctor/${doctorId}/patients`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch patients");
        const patientsData = await response.json();
        setPatients(patientsData.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    }
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );

  // Navigate to patient details page passing selected patient ID
  const handlePatientPress = (patientId) => {
    // router.push(`/Patientprofile/${patientId}`);
    router.push("/Patientprofile");
    // On next page, extract patientId from route parameters to fetch & render
  };

  // Remove patient from doctor’s list via DELETE API
  const handleRemovePatient = async (patientId, patientName) => {
    try {
      const token = await SecureStore.getItemAsync("doctor_jwt");
      if (!token) throw new Error("User not authenticated");
      const payload = parseJwt(token);
      if (!payload || !payload.sub) throw new Error("Invalid token");
      const doctorId = payload.sub;

      Alert.alert(
        "Remove Patient",
        `Are you sure you want to remove ${patientName}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, Remove",
            onPress: async () => {
              const response = await fetch(
                `https://heimdall-server.servehttp.com:8443/doctor/${doctorId}/remove-patient/${patientId}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              if (!response.ok) throw new Error("Failed to remove patient");
              setPatients((prev) =>
                prev.filter((p) => String(p.id) !== String(patientId))
              );
              Alert.alert("Success", `${patientName} has been removed.`);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 p-5 pb-24">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-white text-3xl font-bold">Patient List</Text>
        </View>

        <TextInput
          className="bg-gray-800 text-white rounded-lg p-3 mb-6"
          placeholder="Search patients..."
          placeholderTextColor="#656ca9"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View>
          {filteredPatients.length > 0 ? (
            filteredPatients.map((patient) => (
              <TouchableOpacity
                key={patient.id ? String(patient.id) : Math.random().toString()} // Ensure string type and fallback
                className="bg-gray-800 p-4 rounded-lg flex-row items-center justify-between mb-4"
                onPress={() => handlePatientPress(patient.id)}
                onLongPress={() =>
                  handleRemovePatient(patient.id, patient.name)
                }
              >
                <View className="flex-row items-center">
                  <Ionicons name="person-circle" size={32} color="#0FFF73" />
                  <Text className="text-white text-lg ml-3">
                    {patient.name}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color="gray" />
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-gray-400 text-center">
              No patients found.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
