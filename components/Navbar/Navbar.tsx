import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { usePathname, useRouter } from 'expo-router'

const Navbar = () => {
    const insets = useSafeAreaInsets()
    
    const path = usePathname()
    const route = useRouter()
    return (
        <View style={{ paddingTop: insets.top }} className='flex flex-row px-4 justify-between items-center  py-2 bg-[#141438]'>
            {
                path.includes("AddJournal") ?
                    <>
                        <Text className='text-2xl font-bold text-[#e5e1ff]'>New Journal</Text>
                        <TouchableOpacity onPress={() => route.back()}>

                        <Text className='text-sm font-bold text-[#6d6db9]'>
                            Cancel
                        </Text>
                        </TouchableOpacity>
                    </>
                    :

                    <Text className='text-2xl font-bold text-[#e5e1ff]'>My Journals</Text>
            }
        </View>
    )
}

export default Navbar

