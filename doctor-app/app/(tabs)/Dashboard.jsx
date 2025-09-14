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

const initialPatients = [
  { id: "1", name: "Alice Johnson" },
  { id: "2", name: "Bob Williams" },
  { id: "3", name: "Charlie Brown" },
  { id: "4", name: "David Miller" },
  { id: "5", name: "Eve Davis" },
  { id: "6", name: "Alice Johnson" },
];

export default function Dashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState(
    initialPatients.sort((a, b) => a.name.localeCompare(b.name))
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePatientPress = (patientId) => {
    // This is where you would handle navigation to the patient's profile page
    // router.push(`/patient-profile/${patientId}`);
    //Alert.alert("Patient Profile", `Navigating to ${patientId}'s profile.`);
    router.push("/Patientprofile");
  };

  const handleRemovePatient = (patientId, patientName) => {
    Alert.alert(
      "Remove Patient",
      `Are you sure you want to remove ${patientName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Remove",
          onPress: () => {
            console.log(`Patient ${patientId} removed.`);
            // Implement logic to remove the patient from the list
            setPatients(patients.filter((p) => p.id !== patientId));
            Alert.alert("Success", `${patientName} has been removed.`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 p-5 pb-24">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-white text-3xl font-bold">Patient List</Text>
          {/* <TouchableOpacity className="p-3 bg-gray-800 rounded-full">
            <FontAwesome5 name="user-circle" size={24} color="white" />
          </TouchableOpacity> */}
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
                key={patient.id}
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
