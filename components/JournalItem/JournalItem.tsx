import { View, Text, TouchableOpacity, Vibration } from "react-native";
import React, { useState } from "react";
import { truncateText } from "@/utils/HelperFunctions";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { MaterialIcons } from '@expo/vector-icons';
interface JournalItemProps {
  item: {
    title: string;
    id: string;
    time: string;
    date: string;
  };
  deleteJournal: () => void;
  navigateToReadJournal: () => void;
}

const JournalItem: React.FC<JournalItemProps> = ({
  item,
  deleteJournal,
  navigateToReadJournal,
}) => {
  const [isSelected, setIsSelected] = useState(false); // State to track selection

  const handleLongPress = () => {
    console.log("Long Pressed");
    Vibration.vibrate(17);
    setIsSelected(!isSelected); // Toggle selection state
  };

  const longPressGesture = Gesture.LongPress()
    .minDuration(600)
    .onStart(() => {
      console.log("Long Pressed inside gesture");
      runOnJS(handleLongPress)();
    });

  const journalItemClick = () => {
    if (isSelected) {
      setIsSelected(false);
    } else {
      navigateToReadJournal();
    }
  };

  return (
    <GestureDetector gesture={longPressGesture}>
      <TouchableOpacity
        activeOpacity={0.4}
        onPress={() => {
          journalItemClick();
        }}
        className={`flex flex-row w-full  justify-between items-center px-4   py-4 ${
          isSelected ? "bg-[#585891]" : "bg-[#282854]"
        }  my-2 rounded-lg`}
      >
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
          {isSelected && (
            <TouchableOpacity onPress={() => deleteJournal()}>
              <MaterialIcons name="delete-outline" size={24} color="#ffc8c8" />
              {/* <Text className="text-[#ffc8c8] font-semibold ">Delete</Text> */}
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </GestureDetector>
  );
};

export default JournalItem;
