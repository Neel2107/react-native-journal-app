import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { truncateText } from "@/utils/HelperFunctions";
import { deleteDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebase";

// Define a more comprehensive type for the component props
interface JournalItemProps {
  item: {
    title: string;
    id: string; // Include 'id' in your type definition to avoid TypeScript errors,
    time: string;
    date: string;
  };
  deleteJournal: () => void; // Correctly include deleteJournal as a function prop
}

const JournalItem: React.FC<JournalItemProps> = ({ item, deleteJournal }) => {
  return (
    <View className="flex flex-row w-full  justify-between items-center px-4   py-4 bg-[#282854] my-2 rounded-lg">
      <View className="flex flex-col  ">
        <Text className="text-[#e5e1ff] mb-2 text-lg font-semibold">
          {truncateText(item.title, 30)}
        </Text>

        <View className="flex flex-row  ">
          <Text className="text-[#6d6db9] text-xs">{item.date}</Text>
          <Text className="text-[#6d6db9] text-xs ml-2">{item.time}</Text>
        </View>
      </View>
      <View className="flex flex-row items-center ">
        <Text className="text-[#e5e1ff] font-semibold "></Text>
        <TouchableOpacity onPress={() => deleteJournal()}>
          <Text className="text-[#ffc8c8] font-semibold ">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JournalItem;
