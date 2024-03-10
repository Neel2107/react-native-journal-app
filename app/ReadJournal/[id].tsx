import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { supabase } from "@/utils/supabase";

type JournalType = {
  id: string;
  post_title: string;
  post_content: string;
};

const ReadJournal = () => {
  const [journal, setJournal] = useState<JournalType | null>(null);
  const [loading, setLoading] = useState(true);
  const pathName = usePathname();
  const route = useRouter();
  const insets = useSafeAreaInsets();

  

  useEffect(() => {
    const fetchJournal = async () => {
      setLoading(true); // Assuming you have a setLoading function to indicate loading state
  
      const segments = pathName.split("/"); // Split pathName into segments
      const journalId = segments[segments.length - 1]; // Assuming the last segment is the journalId
      console.log("Journal ID extracted:", journalId);
  
      if (journalId) {
        try {
          const { data, error } = await supabase
            .from("posts") // Replace "journals" with your Supabase table name
            .select("*")
            .eq('id', journalId) // Ensure 'id' matches your column name for the journal ID
            .single(); // Retrieves a single item
  
          if (error) {
            throw error;
          }
  
          if (data) {
            // Assuming data structure matches your JournalType
            setJournal({ id: data.id, ...data } as JournalType);
          } else {
            console.log(`No such document with ID ${journalId}!`);
          }
        } catch (error:any) {
          console.error("Error fetching journal:", error);
          alert(`Error fetching journal: ${error.message || error}`);
        }
      }
  
      setLoading(false);
    };
  
    fetchJournal();
  }, [pathName]);

  console.log(`Journal fetched:`, journal);
  

  if (loading) {
    return (
      <ActivityIndicator
        className="flex-1 bg-[#141438]"
        color={"#fff"}
        size={50}
      />
    );
  }

  if (!journal) {
    return (
      <View className="flex-1 bg-[#141438] px-4">
        <Text>No journal found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#21215b] " style={{ paddingTop: insets.top }}>
      <View className="flex flex-row  items-center justify-between bg-[#21215b] px-4 py-2 ">
        <View className="flex flex-row items-center">
          <TouchableOpacity onPress={() => route.back()}>
            <Ionicons name="chevron-back" size={24} color="#e5e1ff" />
          </TouchableOpacity>
          <Text className="text-2xl ml-2 font-bold text-[#e5e1ff]">
            My Journal
          </Text>
        </View>
        <View className=" flex flex-row items-center">
          <Menu>
            <MenuTrigger>
              <Entypo name="dots-three-vertical" size={17} color="#e5e1ff" />
            </MenuTrigger>
            <MenuOptions
              optionsContainerStyle={{
                backgroundColor: "#30306f",
                padding: 5,
                borderRadius: 10,
              }}
            >
              <MenuOption
                onSelect={() => alert(`Save`)}
                text="Save"
                customStyles={{
                  optionText: { color: "white", fontSize: 15 },
                }}
              />
              <MenuOption onSelect={() => alert(`Delete`)}>
                <Text style={{ color: "red" }}>Delete</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </View>
      <View className="flex-1  bg-[#141439] px-4 py-2">
        <Text className="text-xl font-bold text-[#f0f0f0]">
          {journal?.post_title}
        </Text>
        <ScrollView>
          <Text className="text-[#f0f0f0] text-sm my-2">
            {journal?.post_content}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default ReadJournal;
