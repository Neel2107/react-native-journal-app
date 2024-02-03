import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';


const List = () => {

    const data = [
        {
            title: "Drop off donations",

        },
        {
            title: "Pick up donations",
        },
        {
            title: "Order groceries",
        },
        {
            title: "Order groceries",
        },
        {
            title: "Order groceries",
        },
        {
            title: "Order groceries",
        },
        {
            title: "Order groceries",
        },
        {
            title: "Order groceries",
        },
        {
            title: "Order groceries",
        },
        {
            title: "Pay bills",
        }
    ]

    const renderItem = ({ item }: { item: { title: string } }) => {
        return (

            <View className='flex flex-row w-full  justify-between items-center px-4   py-6 bg-[#282854] my-2 rounded-lg'>
                <Text className='text-[#e5e1ff] text-lg font-semibold'>{item.title}</Text>
                <View className='flex flex-row items-center gap-2'>

                    <Text className='text-[#e5e1ff] font-semibold '>Edit</Text>
                    <Text className='text-[#ffc8c8] font-semibold '>
                        Delete
                    </Text>
                </View>
            </View>
        )
    }
    return (
        <View className='flex-1 bg-[#141439]  items-center justify-center relative px-4'>



            <View className='flex flex-col  '>

                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <View className=' w-full absolute bottom-0 h-32 '>


                <LinearGradient
                    style={{ position: 'absolute', width: '100%', height: '100%' }}
                    colors={['rgba(0,0,0,0.0)', 'rgba(20, 20, 56, 0.5)', '#141438']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />

            </View>

        </View>
    )
}

export default List

