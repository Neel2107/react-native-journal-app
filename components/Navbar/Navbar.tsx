import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Navbar = () => {
  const insets = useSafeAreaInsets();

  const path = usePathname();
  const route = useRouter();
  return (
    <View>

        </View>
  );
};

export default Navbar;
