import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';

const BottomBar = () => {
  const route = useRouter()
  const path = usePathname()
  return (
    <View className="absolute bottom-0 flex-row justify-center w-full pb-3">
      {
        !path.includes("AddJournal") &&
        <TouchableOpacity onPress={() => route.push('/AddJournal/AddJournal')}>

          < View className='bg-[#9191ed] rounded-full p-3'>
            <AntDesign name="plus" className='font-bold' size={30} color="black" />
          </View>
        </TouchableOpacity>
      }

    </View>
  )
}

export default BottomBar