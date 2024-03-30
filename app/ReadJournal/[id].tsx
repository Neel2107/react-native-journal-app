import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "expo-router";

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
import { deleteJoural } from "@/utils/postHelpers";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { moods } from "@/utils/HelperFunctions";
import AsyncStorage from "@react-native-async-storage/async-storage";

type JournalType = {
  id: string;
  journal_title: string;
  journal_content: string;
};

const ReadJournal = () => {
  const [journal, setJournal] = useState<JournalType | null>(null);
  const [loading, setLoading] = useState(true);
  const pathName = usePathname();
  const route = useRouter();
  const insets = useSafeAreaInsets();


  
const storeData = async (key: string, value: JournalType) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    console.error("Error storing data:", e);
    // Handle error...
  }
}

const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.error("Error reading data:", e);
    // Handle error...
  }
}
  useEffect(() => {
    const fetchJournal = async () => {
      setLoading(true);

      const segments = pathName.split("/");
      const journalId = segments[segments.length - 1]; // Assuming the last segment is the journalId

      if (journalId) {

        const storedJournal = await getData(journalId);
        if (storedJournal) {
          setJournal(storedJournal);
          setLoading(false);
        } else {

        try {
          const { data, error } = await supabase
            .from("posts") // Replace "journals" with your Supabase table name
            .select("*")
            .eq("id", journalId) // Ensure 'id' matches your column name for the journal ID
            .single(); // Retrieves a single item

          if (error) {
            throw error;
          }

          if (data) {
            const createdAt = new Date(data.journal_date);
            const formattedDate = createdAt.toLocaleDateString(); // e.g. "3/10/2024"
            const formattedTime = createdAt.toLocaleTimeString(); // e.g. "1:46:54 PM"

            const moodEmoji = moods.find(
              (mood) => mood.id === data.journal_mood
            )?.emoji;
            setJournal({
              id: data.id,
              created_date: formattedDate,
              created_time: formattedTime,
              mood: moodEmoji,
              ...data,
            } as JournalType);
            storeData(journalId, {
              id: data.id,
              created_date: formattedDate,
              created_time: formattedTime,
              mood: moodEmoji,
              ...data,
            } as JournalType);
          } else {
            console.log(`No such document with ID ${journalId}!`);
          }
        } catch (error: any) {
          console.error("Error fetching journal:", error);
          alert(`Error fetching journal: ${error.message || error}`);
        }
      }
      }

      setLoading(false);
    };

    fetchJournal();
  }, [pathName]);

  const deleteJournal = async () => {
    await deleteJoural(journal?.id as any);
    route.back();
  };


  return (
    <Animated.View
      className={"flex-1"}
      entering={SlideInRight}
      exiting={SlideOutRight}
    >
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
                  onSelect={() => {
                    const jouralTitle = journal?.journal_title;
                    const journalContent = journal?.journal_content;
                    route.push({
                      pathname: `/EditJournal/${journal?.id}`,
                      params: {
                        jouralTitle: jouralTitle,
                        journalContent: journalContent,
                      },
                    });
                  }}
                  text="Edit"
                  customStyles={{
                    optionText: { color: "white", fontSize: 15 },
                  }}
                />
                <MenuOption onSelect={deleteJournal}>
                  <Text style={{ color: "red" }}>Delete</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator
            className="flex-1 bg-[#141438]"
            color={"#fff"}
            size={50}
          />
        ) : (
          <View className="flex-1  bg-[#141439] px-4 py-2">
            <View className="flex flex-row  justify-between">
              <Text className="text-xl max-w-xs font-bold text-[#f0f0f0]">
                {journal?.journal_title}
              </Text>
              <View className="flex flex-col   items-end">
                <Text className="text-sm  text-[#f0f0f0bb]">
                  {journal?.created_date}
                </Text>
                <Text className="text-xs   text-[#f0f0f0bb]">
                  {journal?.created_time}
                </Text>

                <View className="p-2 rounded-full mt-2 bg-[#7676ae96]">
                  <Text className="text-2xl">{journal?.mood}</Text>
                </View>
              </View>
            </View>

            <ScrollView>
              <Text className="text-[#f0f0f0] text-sm my-2">
                {journal?.journal_content}
              </Text>
            </ScrollView>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default ReadJournal;
