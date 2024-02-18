import { View, Text, TouchableOpacity, Vibration } from "react-native";
import React, { useState } from "react";
import { truncateText } from "@/utils/HelperFunctions";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableRipple } from "react-native-paper";
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
      <TouchableRipple
        onPress={() => {
          journalItemClick();
        }}
        rippleColor="rgba(0, 0, 0, .40)"
        borderless={true} // Use borderless for circular or irregular shapes
      >
        <View
          className={`flex flex-row w-full  justify-between items-center px-4   py-4 ${
            isSelected ? "bg-[#585891]" : "bg-[#282854]"
          }  my-2 rounded-lg`}
        >
          <View className="flex flex-col  ">
            <Text className="text-[#e5e1ff] mb-2 text-lg font-semibold">
              {truncateText(item.title, 30)}
            </Text>

            <View className="flex flex-row  ">
              <Text
                className={`${
                  isSelected ? "text-[#c0bdd8c2]" : "text-[#6d6db9]"
                }  text-xs`}
              >
                {item.date}
              </Text>
              <Text
                className={`${
                  isSelected ? "text-[#c0bdd8c2]" : "text-[#6d6db9]"
                }  text-xs ml-2`}
              >
                {item.time}
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center ">
            {isSelected && (
              <TouchableRipple
              className="p-2 rounded-full" 
              rippleColor={"rgba(0, 0, 0, .40)"}
              borderless={true}
              onPress={() => deleteJournal()}>
                <MaterialIcons
                  name="delete-outline"
                  size={24}
                  color="#ffc8c8"
                />
              </TouchableRipple>
            )}
          </View>
        </View>
      </TouchableRipple>
    </GestureDetector>
  );
};

export default JournalItem;
