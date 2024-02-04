import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { FIREBASE_DB } from "@/firebase";
import JournalItem from "@/components/JournalItem/JournalItem";
import { formatTimestamp } from "@/utils/HelperFunctions";
import { useRouter } from "expo-router";

export interface Journal {
  title: string;
  done: boolean;
  id: string;
  timestamp: string;
  date: string;
  time: string;
}
const List = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const journalRef = collection(FIREBASE_DB, "journal");
    // Update the orderBy clause to use the "timestamp" field
    const q = query(journalRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const journalsList: Journal[] = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data() as Journal;
        const { formattedDate, formattedTime } = formatTimestamp(
          data.timestamp
        );
        journalsList.push({
          ...data,
          id: doc.id,
          title: data.title,
          date: formattedDate, // Now in DD/MM/YYYY
          time: formattedTime, // Now in hh:mm AM/PM
        });
      });
      // Sorting is not needed anymore since Firestore is doing it already
      setJournals(journalsList);
      setLoading(false); // Set loading to false once data is fetched

    });

    return () => unsubscribe();
  }, []);

  const router = useRouter();

  const renderItem = ({ item }: any) => {
    // Use the router from expo-router

    const deleteJournal = async () => {
      await deleteDoc(doc(FIREBASE_DB, "journal", item.id));
    };

    const navigateToReadJournal = () => {
      console.log("Journal ID being passed:", item.id); // This should log the correct ID

      // Navigate to the ReadJournal route and pass the item as a parameter
      router.push(`/ReadJournal/${item.id}`);
    };

    return (
      <JournalItem
        item={item}
        deleteJournal={deleteJournal}
        navigateToReadJournal={navigateToReadJournal}
      />
    );
  };


  if (loading) {
    return <ActivityIndicator className='flex-1 bg-[#141438]' color={'#fff'}  size={50}/>;
  }
  return (
    <View className="flex-1 bg-[#141439]  items-center justify-center relative px-4">
      <View className="flex flex-col  ">
        <FlatList
          data={journals}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View className="flex flex-col items-center ">
              <Image
                className="h-60 w-60"
                source={require("../assets/images/no-journals/no-journals.png")}
              />

              <Text className="text-[#e5e1ff] text-xl">Add your journals</Text>
            </View>
          )}
          keyExtractor={(journal: Journal) => journal.id}
        />
      </View>
      {/* bottom gradient */}
      <View className=" w-full absolute bottom-0 h-32 ">
        <LinearGradient
          style={{ position: "absolute", width: "100%", height: "100%" }}
          colors={["rgba(0,0,0,0.0)", "rgba(20, 20, 56, 0.5)", "#141438"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </View>
    </View>
  );
};

export default List;
