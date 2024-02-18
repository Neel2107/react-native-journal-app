import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebase";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";

type JournalType = {
  id: string;
  title: string;
  journal: string;
};

const ReadJournal = () => {
  const [journal, setJournal] = useState<JournalType | null>(null);
  const [loading, setLoading] = useState(true);
  const pathName = usePathname();
  const route = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchJournal = async () => {
      // Extract the journal ID from the router path
      const segments = pathName.split("/"); // Split pathName into segments
      const journalId = segments[segments.length - 1]; // Assuming the last segment is the journalId
      console.log("Journal ID extracted:", journalId);

      if (journalId) {
        try {
          const docRef = doc(FIREBASE_DB, "journal", journalId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setJournal({ id: docSnap.id, ...docSnap.data() } as JournalType);
          } else {
            console.log(`No such document with ID ${journalId}!`);
          }
        } catch (error) {
          console.error("Error fetching journal:", error);
          alert(`Error fetching journal: ${(error as any).message}`);
        }
      }

      setLoading(false);
    };

    fetchJournal();
  }, [pathName]);

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
          <Entypo name="dots-three-vertical" size={17} color="#e5e1ff" />

          <Text className="text-sm  text-[#e5e1ff]"></Text>
        </View>
      </View>
      <View className="flex-1  bg-[#141438] px-4 py-2">
        <Text className="text-xl font-bold text-[#e5e1ff]">
          {journal?.title}
        </Text>
        <Text className="text-[#e5e1ff] text-sm my-2">{journal?.journal}</Text>
      </View>
    </View>
  );
};

export default ReadJournal;
