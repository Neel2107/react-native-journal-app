import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";

import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { moods } from "@/utils/HelperFunctions";
import { TouchableRipple } from "react-native-paper";
import { createJournal } from "@/utils/postHelpers";

const AddJournal = () => {
  const [journal, setJournal] = useState<string>("");
  const [journalTitle, setJournalTitle] = useState<string>("");
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<string>("date");
  const [show, setShow] = useState<Boolean>(false);
  const [day, setDay] = useState<string>(date.getDate().toString());
  const [month, setMonth] = useState<string>(
    date.toLocaleString("default", { month: "short" })
  );
  const [year, setYear] = useState<string>(date.getFullYear().toString());
  const [selectedTime, setSelectedTime] = useState(formatTime(new Date()));
  const [mood, setMood] = useState(moods[0]);

  const route = useRouter();
  const insets = useSafeAreaInsets();

  const handleSelectMood = (moodObject: any) => {
    setMood(moodObject);
  };

  const onChange = (event: any, selectedValue: any) => {
    setShow(Platform.OS === "ios");
    if (selectedValue) {
      const currentDate = selectedValue || date; // Fallback to current date if undefined
      setDate(currentDate);

      if (mode === "date") {
        // Date has been selected, update the date and its components
        setDay(currentDate.getDate().toString());
        setMonth(currentDate.toLocaleString("default", { month: "short" }));
        setYear(currentDate.getFullYear().toString());
      } else if (mode === "time") {
        // Time has been selected, update the time component
        setSelectedTime(formatTime(currentDate));
      }
    }
  };

  function formatTime(date: any) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours || 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const formatDateWithTimezone = (date: any) => {
    const timeZoneOffset = -date.getTimezoneOffset();
    const diff = timeZoneOffset >= 0 ? "+" : "-";
    const pad = (n: any) => (n < 10 ? "0" + n : n);
    const offset = Math.abs(timeZoneOffset);
    const hoursOffset = Math.floor(offset / 60);
    const minutesOffset = offset % 60;

    // Format the date and time with timezone offset
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}${diff}${pad(hoursOffset)}:${pad(minutesOffset)}`;
  };

  const addJournal = async () => {
    const timestamp = formatDateWithTimezone(date); // Format date with local timezone
   
    const moodID = mood.id;

    await createJournal(timestamp, journalTitle, journal, moodID);
    route.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, paddingTop: insets.top }}
      className="bg-[#141438]"
    >
      <View className="flex flex-row px-4 items-center justify-between py-2">
        <TouchableRipple
          rippleColor="rgba(0, 0, 0, .32)"
          borderless={true}
          style={{ borderRadius: 50 }}
          onPress={() => route.back()}
        >
          <Ionicons name="close" size={24} color="#6d6db9" />
        </TouchableRipple>

        <TouchableRipple
          rippleColor="rgba(0, 0, 0, .32)"
          className="flex fl  justify-center items-center px-4  py-1 bg-[#9191ed]  rounded-md"
          disabled={journal === "" && journalTitle === ""}
          onPress={addJournal}
        >
          <Text
            className={`text-base font-semibold ${
              journal === "" && journalTitle === ""
                ? "text-[#6d6db9]"
                : "text-[#1d1d46]"
            }`}
          >
            Add
          </Text>
        </TouchableRipple>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 flex-col items-center  ">
          <View className="w-full flex flex-row items-center justify-between px-4 py-2">
            <TouchableOpacity
              onPress={() => showMode("date")}
              className="flex flex-row items-baseline"
            >
              <Text className="text-white/80 text-3xl font-semibold  ">
                {day}
              </Text>
              <Text className="text-white/80 text-base mx-2">{month}</Text>
              <Text className="text-white/80 text-base">{year} </Text>
              <View className="mx-2">
                <FontAwesome name="caret-down" size={17} color="#6d6db9" />
              </View>
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                onChange={onChange}
              />
            )}
            <Menu>
              <MenuTrigger>
                <View className="p-2 rounded-full bg-[#7676ae96]">
                  <Text className="text-2xl">{mood.emoji}</Text>
                </View>
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{
                  backgroundColor: "#30306f",
                  padding: 8,
                  borderRadius: 10,
                }}
              >
                <View>
                  <Text className="text-white pl-2 my-2 font-semibold">
                    How's your day?
                  </Text>
                  <View className="flex flex-row  flex-wrap">
                    {moods.map((mood, index) => (
                      <MenuOption
                        key={index}
                        onSelect={() => handleSelectMood(mood)}
                        text={mood.emoji}
                        customStyles={{
                          optionText: { fontSize: 25 },
                        }}
                      />
                    ))}
                  </View>
                </View>
              </MenuOptions>
            </Menu>
          </View>
          <View className="w-full px-4 mt-5">
            <TextInput
              className="text-white w-full text-xl mb-2 "
              placeholder="Title"
              value={journalTitle}
              onChangeText={(text: string) => setJournalTitle(text)}
              placeholderTextColor={"#4e4e7c"}
              cursorColor={"white"}
            />
            <TextInput
              multiline
              className="text-white w-full text-base  "
              placeholder="Write more here..."
              value={journal}
              onChangeText={(text: string) => setJournal(text)}
              placeholderTextColor={"#4e4e7c"}
              cursorColor={"white"}
            />
          </View>

          <View className=" flex flex-col  w-full px-4 mt-auto">
            <View className="flex flex-row w-full  justify-between items-center px-4  py-6 bg-[#282854] my-2 rounded-xl">
              <View>
                <Text className="text-[#e5e1ff] text-lg font-semibold">
                  Journal
                </Text>
              </View>
              <View className="flex flex-row items-center ">
                <TouchableOpacity
                  onPress={() => showMode("time")}
                  className="flex flex-row  items-center"
                >
                  <Text className="text-[#e5e1ff]  font-semibold ">
                    {selectedTime}
                  </Text>
                  <Entypo name="chevron-right" size={15} color="#e5e1ff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddJournal;
