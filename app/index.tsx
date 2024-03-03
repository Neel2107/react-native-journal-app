import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import { Searchbar, TouchableRipple } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";

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
  const [loading, setLoading] = useState<boolean>(true); // Add a loading state
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(
    null
  );

  const [isSearchEnabled, setisSearchEnabled] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJournals, setFilteredJournals] = useState<Journal[]>([]); // Add this line

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

  useEffect(() => {
    // Filter journals based on the search query
    const filtered = journals.filter((journal) => {
      // Adjust this condition to search in other fields if necessary
      return journal.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredJournals(filtered);
  }, [journals, searchQuery]); // This useEffect depends on journals and searchQuery

  const renderItem = ({ item }: { item: Journal }) => {
    const deleteJournal = async () => {
      await deleteDoc(doc(FIREBASE_DB, "journal", item.id));
    };

    const navigateToReadJournal = () => {
      Vibration.vibrate(11);
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
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <ActivityIndicator
        className="flex-1 bg-[#141438]"
        color={"#fff"}
        size={50}
      />
    );
  }
  return (
    <View className="flex-1 bg-[#141438]"> 
      <View
        style={{ paddingTop: insets.top }}
        className="flex flex-row px-4 justify-between items-center  py-2 bg-[#21215b]"
      >
        <StatusBar animated />
        {isSearchEnabled ? (
          <>
            <Searchbar
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              className={
                "bg-transparent border border-[#9191ed] w-[90%]  text-[#e5e1ff] "
              }
              iconColor="#e5e1ff"
              inputStyle={{
                color: "#e5e1ff",
                width: "100%",
              
                height: "100%", // Match the height of the Searchbar
              }}
            
              placeholderTextColor={"#e5e1ff"}
              style={{
                height: "100%",
              }}
              theme={{
                colors: {
                  text: "#e5e1ff",
                },
              }}
            />

            {!(searchQuery.length > 0) && (
              <Animated.View entering={FadeInLeft} exiting={FadeOutLeft}>
                <AntDesign
                  name="close"
                  onPress={() => setisSearchEnabled(false)}
                  size={22}
                  color="#e5e1ff"
                />
              </Animated.View>
            )}
          </>
        ) : (
          <>
            <Text className="text-2xl font-bold text-[#e5e1ff]">Home</Text>
            <TouchableRipple
              className="p-2"
              onPress={() => {
                setisSearchEnabled(true);
              }}
              rippleColor="rgba(0, 0, 0, .40)"
              borderless={true} // Use borderless for circular or irregular shapes
              style={{ borderRadius: 50 }} // Match the rounded-full style
            >
              <Text>
                <FontAwesome name="search" size={20} color="#e5e1ff" />
              </Text>
            </TouchableRipple>
          </>
        )}
      </View>
      <View className="flex-1 bg-[#141439]  items-center justify-center relative py-2 ">
        <View className="flex flex-col   ">
          <FlatList
            data={filteredJournals}
            renderItem={renderItem}
            
            ListEmptyComponent={() => (

              <View className="flex flex-col items-center ">
                <Image
                  className="h-60 w-60"
                  source={require("../assets/images/no-journals/no-journals.png")}
                />

                <Text className="text-[#e5e1ff] text-xl">
                  Add your journals
                </Text>
              </View>
            )}
            keyExtractor={(journal: Journal) => journal.id}
            contentContainerStyle={{ paddingBottom: 100 }} // Add extra space at the bottom
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
    </View>
  );
};

export default List;
