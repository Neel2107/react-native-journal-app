import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { TouchableRipple } from "react-native-paper";

const BottomBar = () => {
  const route = useRouter();
  const path = usePathname();
  return (
    <View className="absolute bottom-0 flex-row justify-center w-full pb-3">
      {!path.includes("AddJournal") && (
        <TouchableRipple
          rippleColor="rgba(0, 0, 0, .40)"
          borderless
          className=" rounded-full"
          onPress={() => route.push("/AddJournal/AddJournal")}
        >
          <View className=" p-3 bg-[#9191ed] rounded-full">
            <AntDesign
              name="plus"
              className="font-bold"
              size={30}
              color="black"
            />
          </View>
        </TouchableRipple>
      )}
    </View>
  );
};

export default BottomBar;
