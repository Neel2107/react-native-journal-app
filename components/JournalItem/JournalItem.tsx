import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { truncateText } from '@/utils/HelperFunctions'
import { deleteDoc, doc } from 'firebase/firestore'
import { FIREBASE_DB } from '@/firebase'

const JournalItem = ({ item: { title }, deleteJournal } : { item: { title: string, id: string } }) => {


   

    return (
        <View className='flex flex-row w-full  justify-between items-center px-4   py-6 bg-[#282854] my-2 rounded-lg'>
            <Text className='text-[#e5e1ff] text-lg font-semibold'>
                {
                    truncateText(title, 20)
                }
            </Text>
            <View className='flex flex-row items-center gap-2'>

                <Text className='text-[#e5e1ff] font-semibold '>Edit</Text>
                <TouchableOpacity onPress={() => deleteJournal()}>

                <Text className='text-[#ffc8c8] font-semibold '>
                    Delete
                </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default JournalItem