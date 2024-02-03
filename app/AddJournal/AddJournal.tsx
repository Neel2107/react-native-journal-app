import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import { FIREBASE_DB } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const AddJournal = () => {

  const [journal, setJournal] = useState<string>('')

  useEffect(() => {

  }, [])

  const route = useRouter()

  const addJournal = async () => {
    const doc = addDoc(collection(FIREBASE_DB, "journal"), {
      title: journal,
      done: false
    })
    route.back()
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>


        <View className='flex-1 flex-col items-center  bg-[#141438]'>

          <View className='w-full px-4 mt-5
     '>
            <TextInput
              className='text-[#4e4e7c] w-full text-2xl  '
              placeholder='Enter your thoughts'
              value={journal}
              onChangeText={(text: string) => setJournal(text)}
              placeholderTextColor={"#4e4e7c"}
              cursorColor={"white"}
            />
          </View>


          <View className=' flex flex-col gap-2 w-full px-4 mt-40'>
            <View className='flex flex-row w-full  justify-between items-center px-4  py-6 bg-[#282854] my-2 rounded-xl'>
              <Text className='text-[#e5e1ff] text-lg font-semibold'>Journal</Text>
              <View className='flex flex-row items-center gap-2'>

                <View className='flex flex-row gap-2 items-center'>

                  <Text className='text-[#e5e1ff] font-semibold '>
                    Thoughts
                  </Text>
                  <Entypo name="chevron-right" size={15} color="#e5e1ff" /></View>
              </View>
            </View>
          </View>

          <View className=' flex flex-col gap-2 w-full px-4 mt-10'>
            <TouchableOpacity disabled={journal === ""} onPress={addJournal} className='flex flex-row w-full  justify-center items-center px-4  py-6 bg-[#9191ed] my-2 rounded-xl'>
              <Text className='text-[#1d1d46] text-lg font-semibold'>Add Journal</Text>

            </TouchableOpacity>
          </View>


        </View>
      </ScrollView>

    </KeyboardAvoidingView>
  )
}

export default AddJournal