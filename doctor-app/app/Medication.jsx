import { FontAwesome5, Ionicons } from "@expo/vector-icons";
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

// Placeholder data for medications
const initialMedications = [
  {
    id: 1,
    name: "Levodopa",
    dosage: "1 tablet",
    time: "8:00 AM",
    description: "Take with a glass of water, 30 minutes before food.",
  },
  {
    id: 2,
    name: "Carbidopa",
    dosage: "1 tablet",
    time: "1:00 PM",
    description: "Can be taken with or without food.",
  },
];

export default function Medication() {
  const router = useRouter();
  const [medications, setMedications] = useState(initialMedications);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMedication, setCurrentMedication] = useState({
    id: null,
    name: "",
    dosage: "",
    time: "",
    description: "",
  });

  const handleAddMedication = () => {
    setIsEditing(true);
    setCurrentMedication({
      id: null,
      name: "",
      dosage: "",
      time: "",
      description: "",
    });
  };

  const handleEditMedication = (med) => {
    setIsEditing(true);
    setCurrentMedication(med);
  };

  const handleSaveMedication = () => {
    if (!currentMedication.name || !currentMedication.dosage) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (currentMedication.id) {
      // Logic for editing an existing medication
      setMedications(
        medications.map((med) =>
          med.id === currentMedication.id ? currentMedication : med
        )
      );
      Alert.alert("Success", "Medication updated successfully.");
    } else {
      // Logic for adding a new medication
      const newMed = { ...currentMedication, id: Date.now() };
      setMedications([...medications, newMed]);
      Alert.alert("Success", "Medication added successfully.");
    }

    setIsEditing(false);
    setCurrentMedication({
      id: null,
      name: "",
      dosage: "",
      time: "",
      description: "",
    });
  };

  const handleRemoveMedication = (id) => {
    Alert.alert(
      "Remove Medication",
      "Are you sure you want to remove this medication?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => {
            setMedications(medications.filter((med) => med.id !== id));
            Alert.alert("Success", "Medication removed.");
          },
        },
      ]
    );
  };

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
        <TouchableOpacity onPress={handleAddMedication}>
          <Ionicons name="add-circle" size={36} color="#0FFF73" />
        </TouchableOpacity>
      </View>
      {medications.map((med) => (
        <View
          key={med.id}
          className="bg-gray-800 p-4 rounded-lg flex-row items-center justify-between mb-4"
        >
          <View className="flex-1">
            <Text className="text-white text-lg font-bold">{med.name}</Text>
            <Text className="text-gray-400 mt-1">{med.dosage}</Text>
            <Text className="text-green-500 font-bold mt-2">{med.time}</Text>
            <Text className="text-gray-500 text-sm mt-1">
              {med.description}
            </Text>
          </View>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => handleEditMedication(med)}
              className="mr-3"
            >
              <FontAwesome5 name="edit" size={24} color="#0FFF73" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemoveMedication(med.id)}>
              <Ionicons
                name="remove-circle-outline"
                size={30}
                color="#EF4444"
              />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );

  const renderMedicationForm = () => (
    <View>
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => setIsEditing(false)}>
          <Ionicons name="arrow-back-circle-outline" size={32} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold ml-4">
          {currentMedication.id ? "Edit Medication" : "Add Medication"}
        </Text>
      </View>

      <View className="bg-gray-800 p-5 rounded-lg mb-6">
        <Text className="text-white text-lg font-bold mb-4">
          Medication Details
        </Text>
        <Text className="text-gray-400 mb-2">Name</Text>
        <TextInput
          className="bg-gray-700 text-white rounded-md p-3 mb-4"
          value={currentMedication.name}
          onChangeText={(text) =>
            setCurrentMedication({ ...currentMedication, name: text })
          }
        />
        <Text className="text-gray-400 mb-2">Dosage Amount</Text>
        <TextInput
          className="bg-gray-700 text-white rounded-md p-3 mb-4"
          value={currentMedication.dosage}
          onChangeText={(text) =>
            setCurrentMedication({ ...currentMedication, dosage: text })
          }
        />
        <Text className="text-gray-400 mb-2">Time</Text>
        <TextInput
          className="bg-gray-700 text-white rounded-md p-3 mb-4"
          value={currentMedication.time}
          onChangeText={(text) =>
            setCurrentMedication({ ...currentMedication, time: text })
          }
        />
        <Text className="text-gray-400 mb-2">Description</Text>
        <TextInput
          className="bg-gray-700 text-white rounded-md p-3 mb-4"
          value={currentMedication.description}
          onChangeText={(text) =>
            setCurrentMedication({ ...currentMedication, description: text })
          }
        />
        <TouchableOpacity
          className="p-4 bg-green-500 rounded-full"
          onPress={handleSaveMedication}
        >
          <Text className="text-black text-lg font-bold text-center">
            {currentMedication.id ? "Save Changes" : "Add Medication"}
          </Text>
        </TouchableOpacity>
      </View>
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
