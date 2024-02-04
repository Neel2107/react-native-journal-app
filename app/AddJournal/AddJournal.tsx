import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { FIREBASE_DB } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "expo-router";
import { getCurrentTime, getTodaysDate } from "@/utils/HelperFunctions";

const AddJournal = () => {
  const [journal, setJournal] = useState<string>("");
  const [journalTitle, setJournalTitle] = useState<string>('')

  useEffect(() => {}, []);

  const route = useRouter();

  const currentTime = getCurrentTime();
  const todayDate = getTodaysDate();

  const addJournal = async () => {
    const doc = addDoc(collection(FIREBASE_DB, "journal"), {
      title: journalTitle,
      journal: journal,
      timestamp: getTodaysDate()
    });
    route.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 flex-col items-center  bg-[#141438]">
          <View
            className="w-full px-4 mt-5"
          >
            <TextInput
              className="text-[#4e4e7c] w-full text-2xl mb-2 "
              placeholder="Title"
              value={journalTitle}
              onChangeText={(text: string) => setJournalTitle(text)}
              placeholderTextColor={"#4e4e7c"}
              cursorColor={"white"}
            />
            <TextInput
              className="text-[#4e4e7c] w-full text-lg  "
              placeholder="Write here..."
              value={journal}
              onChangeText={(text: string) => setJournal(text)}
              placeholderTextColor={"#4e4e7c"}
              cursorColor={"white"}
            />
          </View>

          <View className=" flex flex-col  w-full px-4 mt-40">
            <View className="flex flex-row w-full  justify-between items-center px-4  py-6 bg-[#282854] my-2 rounded-xl">
              <View>

              <Text className="text-[#e5e1ff] text-lg font-semibold">
                Journal
              </Text>
              </View>
              <View className="flex flex-row items-center ">
                <View className="flex flex-row  items-center">
                  <Text className="text-[#e5e1ff]  font-semibold ">
                    {currentTime}
                  </Text>
                  <Entypo name="chevron-right" size={15} color="#e5e1ff" />
                </View>
              </View>
            </View>
          </View>

          <View className=" flex flex-col  w-full px-4 mt-10">
            <TouchableOpacity
              disabled={journal === "" && journalTitle === ""}
              onPress={addJournal}
              className="flex flex-row w-full  justify-center items-center px-4  py-6 bg-[#9191ed] my-2 rounded-xl"
            >
              <Text className="text-[#1d1d46] text-lg font-semibold">
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddJournal;
