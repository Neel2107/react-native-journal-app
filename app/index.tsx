import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import JournalItem from "@/components/JournalItem/JournalItem";
import { formatTimestamp } from "@/utils/HelperFunctions";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Searchbar, TouchableRipple } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";
import { deleteJoural, getPosts } from "@/utils/postHelpers";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { sortOptions } from "@/constants/sortOptions";

export interface Journal {
  title: string;
  id: string;
  jouranl_date: string;
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
  const [sortOption, setSortOption] = useState<number>(1); // Default to "Recent"
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchJournals()
      .then(() => {
        setRefreshing(false);
      })
      .catch((error) => {
        console.error("Error refreshing journals:", error);
        setRefreshing(false);
      });
  }, []);

  const sortJournals = (journals: any) => {
    
    return [...journals].sort((a, b) => {
      // Parsing the sorting_date field to get time in milliseconds for comparison
      const dateA = new Date(a.sorting_date).getTime();
      const dateB = new Date(b.sorting_date).getTime();

      switch (sortOption) {
        case 1: // Recent first - descending order by date
          return dateB - dateA;
        case 2: // Oldest first - ascending order by date
          return dateA - dateB;
        case 3: // Title A-Z
          return a.title.localeCompare(b.title);
        case 4: // Title Z-A
          return b.title.localeCompare(a.title);
        default:
          // In case of an unknown sortOption, don't sort
          return 0;
      }
    });
  };

  const fetchJournals = async () => {
    setLoading(true); // Assuming you have a setLoading state updater
    try {
      const journalsList = await getPosts();
      const formattedJournals = journalsList.map((journal) => {
        const { formattedDate, formattedTime } = formatTimestamp(
          journal.journal_date
        );
        return {
          id: journal.id,
          title: journal.journal_title,
          content: journal.journal_content,
          mood: journal.journal_mood,
          date: formattedDate, // Formatted date
          time: formattedTime, // Formatted time
          sorting_date: journal.journal_date,
        };
      });
      setJournals(sortJournals(formattedJournals)); // Apply sorting here
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading to false once data is fetched or if there's an error
    }
  };

  useEffect(() => {
    fetchJournals();
  }, [sortOption]);

  const router = useRouter();

  useEffect(() => {
    // Filter journals based on the search query
    const filtered = journals.filter((journal) => {
      // Adjust this condition to search in other fields if necessary
      return journal.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredJournals(filtered);
  }, [journals, searchQuery]);

  const renderItem = ({ item }: { item: Journal }) => {
   
    const deleteJournal = async () => {
      try {
        await deleteJoural(item.id);
        setJournals((journals) =>
          journals.filter((journal) => journal.id !== item.id)
        );
      } catch (error) {
        console.error("Failed to delete journal:", error);
        alert("Failed to delete journal.");
      }
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

  // if (loading) {
  //   return (
  //     <ActivityIndicator
  //       className="flex-1 bg-[#141438]"
  //       color={"#fff"}
  //       size={50}
  //     />
  //   );
  // }
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
            <View className="flex flex-row items-center space-x-2">
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
              <Menu>
                <MenuTrigger>
                  <Entypo
                    name="dots-three-vertical"
                    size={17}
                    color="#e5e1ff"
                  />
                </MenuTrigger>
                <MenuOptions
                  optionsContainerStyle={{
                    backgroundColor: "#30306f",
                    paddingVertical: 10,
                    borderRadius: 10,
                    width: 150,
                    marginTop: 25,
                    gap: 10,
                  }}
                >
                  <MenuOption
                    onSelect={() => alert(`Save`)}
                    text="Sort by"
                    customStyles={{
                      optionText: {
                        color: "white",
                        fontSize: 17,
                        borderBottomColor: "#fff",
                        paddingHorizontal: 10,
                      },
                    }}
                  />
                  {sortOptions.map((option) => (
                    <MenuOption
                      onSelect={() => setSortOption(option.value)}
                      key={option.value}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 15,
                          paddingHorizontal: 10,
                        }}
                      >
                        {option.name}
                      </Text>
                    </MenuOption>
                  ))}
                </MenuOptions>
              </Menu>
            </View>
          </>
        )}
      </View>
      <View className="flex-1 bg-[#141439]  items-center justify-center relative py-2 ">
        {loading ? (
          <ActivityIndicator
            className="flex-1 bg-[#141438]"
            color={"#fff"}
            size={50}
          />
        ) : (
          <>
            <View className="flex flex-col   ">
              <FlatList
                data={filteredJournals}
                renderItem={renderItem}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#141439", "#141439"]} // Optional: customize the colors
                  />
                }
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
                contentContainerStyle={{ paddingBottom: 100 }} 
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
          </>
        )}
      </View>
    </View>
  );
};

export default List;
