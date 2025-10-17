import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

// JWT decoder to extract doctorId
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

export default function Medication() {
  const params = useLocalSearchParams();
  const patientId = params.id;
  const router = useRouter();

  const [prescriptions, setPrescriptions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);

  // Medication form state (for a single medicine)
  const [medicine, setMedicine] = useState({
    name: "",
    quantity: "",
    units: "",
    frequency: "",
    instructions: "",
  });

  useEffect(() => {
    if (patientId) fetchMedications();
  }, [patientId]);

  // Fetch all prescriptions
  async function fetchMedications() {
    try {
      const res = await fetch(
        `https://heimdall-server.servehttp.com:8443/prescription/patient/${patientId}`
      );
      if (!res.ok) throw new Error("Failed to fetch medications");
      const data = await res.json();
      setPrescriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      Alert.alert("Error", err.message);
      setPrescriptions([]);
    }
  }

  // Add new medication or replace (edit) by delete-then-add
  async function handleSaveMedication() {
    try {
      const token = await SecureStore.getItemAsync("doctor_jwt");
      if (!token) throw new Error("Doctor not authenticated");
      const payload = parseJwt(token);
      const doctorId = payload.sub;

      if (
        !medicine.name ||
        !medicine.quantity ||
        !medicine.units ||
        !medicine.frequency
      ) {
        Alert.alert("Error", "Please fill all required fields.");
        return;
      }

      // If editing: delete old prescription before creating new
      if (editingPrescription) {
        await fetch(
          `https://heimdall-server.servehttp.com:8443/prescription/patient/${patientId}?time=${editingPrescription.prescribedAt}`,
          { method: "DELETE" }
        );
      }

      // POST new prescription
      const postRes = await fetch(
        `https://heimdall-server.servehttp.com:8443/prescription/doctor/${doctorId}/prescribe/${patientId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medicines: [{ ...medicine }],
            warning: 0,
            danger: 0,
          }),
        }
      );
      if (!postRes.ok) throw new Error("Failed to save medication.");
      setIsEditing(false);
      setMedicine({
        name: "",
        quantity: "",
        units: "",
        frequency: "",
        instructions: "",
      });
      setEditingPrescription(null);
      fetchMedications();
      Alert.alert(
        "Success",
        editingPrescription ? "Medication updated" : "Medication added"
      );
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  }

  // Open edit form for selected prescription (loads only the first medicine for editing)
  function handleEditMedication(prescription) {
    const med = prescription.medicines[0] || {
      name: "",
      quantity: "",
      units: "",
      frequency: "",
      instructions: "",
    };
    setEditingPrescription(prescription);
    setMedicine({ ...med });
    setIsEditing(true);
  }

  // Delete prescription by prescribedAt timestamp
  async function handleRemoveMedication(prescription) {
    Alert.alert(
      "Remove Medication",
      "Are you sure you want to remove this medication?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: async () => {
            try {
              const res = await fetch(
                `https://heimdall-server.servehttp.com:8443/prescription/patient/${patientId}?time=${prescription.prescribedAt}`,
                { method: "DELETE" }
              );
              if (!res.ok) throw new Error("Failed to delete");
              fetchMedications();
              Alert.alert("Success", "Medication removed.");
            } catch (err) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  }

  // Form for add/edit
  const renderMedicationForm = () => (
    <View>
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => {
            setIsEditing(false);
            setEditingPrescription(null);
          }}
        >
          <Ionicons name="arrow-back-circle-outline" size={32} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold ml-4">
          {editingPrescription ? "Edit Medication" : "Add Medication"}
        </Text>
      </View>
      <View className="bg-gray-800 p-5 rounded-lg mb-6">
        <Text className="text-white text-lg font-bold mb-4">
          Medication Details
        </Text>
        <Text className="text-gray-400 mb-2">Name</Text>
        <TextInput
          className="bg-gray-700 text-white rounded-md p-3 mb-4"
          value={medicine.name}
          onChangeText={(t) => setMedicine({ ...medicine, name: t })}
        />
        <Text className="text-gray-400 mb-2">Quantity</Text>
        <TextInput
          className="bg-gray-700 text-white rounded-md p-3 mb-4"
          value={medicine.quantity}
          onChangeText={(t) => setMedicine({ ...medicine, quantity: t })}
          keyboardType="numeric"
        />
        <Text className="text-gray-400 mb-2">Units</Text>
        <TextInput
          className="bg-gray-700 text-white rounded-md p-3 mb-4"
          value={medicine.units}
          onChangeText={(t) => setMedicine({ ...medicine, units: t })}
        />
        <Text className="text-gray-400 mb-2">Frequency</Text>
        <TextInput
          className="bg-gray-700 text-white rounded-md p-3 mb-4"
          value={medicine.frequency}
          onChangeText={(t) => setMedicine({ ...medicine, frequency: t })}
        />
        <Text className="text-gray-400 mb-2">Instructions (Optional)</Text>
        <TextInput
          className="bg-gray-700 text-white rounded-md p-3 mb-4"
          value={medicine.instructions}
          onChangeText={(t) => setMedicine({ ...medicine, instructions: t })}
        />
        <TouchableOpacity
          className="p-4 bg-green-500 rounded-full"
          onPress={handleSaveMedication}
        >
          <Text className="text-black text-lg font-bold text-center">
            {editingPrescription ? "Save Changes" : "Add Medication"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // List all prescriptions (each can have multiple medicines)
  const renderMedicationList = () => (
    <View>
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back-circle-outline" size={32} color="white" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white text-3xl font-bold">
            Medication Schedule
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setEditingPrescription(null);
            setMedicine({
              name: "",
              quantity: "",
              units: "",
              frequency: "",
              instructions: "",
            });
            setIsEditing(true);
          }}
        >
          <Ionicons name="add-circle" size={36} color="#0FFF73" />
        </TouchableOpacity>
      </View>
      {prescriptions.length === 0 ? (
        <Text className="text-gray-400 text-center mt-4">
          No medications assigned yet.
        </Text>
      ) : (
        prescriptions.map((prescription) => (
          <View
            key={prescription.id + prescription.prescribedAt}
            className="bg-gray-800 p-4 rounded-lg mb-4"
          >
            <Text className="text-green-500 font-bold mb-2">
              Prescribed At:{" "}
              {new Date(prescription.prescribedAt).toLocaleString()}
            </Text>
            {prescription.medicines.map((med, idx) => (
              <View key={idx} className="mb-2">
                <Text className="text-white text-lg font-bold">{med.name}</Text>
                <Text className="text-gray-400 mt-1">
                  Quantity: {med.quantity} {med.units}
                </Text>
                <Text className="text-gray-400 mt-1">
                  Frequency: {med.frequency}
                </Text>
                {med.instructions && (
                  <Text className="text-gray-500 text-sm mt-1">
                    {med.instructions}
                  </Text>
                )}
              </View>
            ))}
            <View className="flex-row mt-2">
              <TouchableOpacity
                onPress={() => handleEditMedication(prescription)}
                className="mr-5"
              >
                <FontAwesome5 name="edit" size={24} color="#0FFF73" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRemoveMedication(prescription)}
              >
                <Ionicons
                  name="remove-circle-outline"
                  size={30}
                  color="#EF4444"
                />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1 p-5 pb-24">
        {isEditing ? renderMedicationForm() : renderMedicationList()}
      </ScrollView>
    </SafeAreaView>
  );
}
