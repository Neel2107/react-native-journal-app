import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebase";
import JournalItem from "@/components/JournalItem/JournalItem";

export interface Journal {
    title: string;
    done: boolean;
    id: string;
}
const List = () => {
    const [journals, setJournals] = useState<Journal[]>([]);

    useEffect(() => {
        const journalRef = collection(FIREBASE_DB, "journal");

        const subscribe = onSnapshot(journalRef, {
            next: (snapshot) => {

                const journalsList: Journal[] = [];
                snapshot.docs.forEach((doc) => {
                    journalsList.push({ ...doc.data(), id: doc.id } as Journal);
                });
                setJournals(journalsList);
            },
        });

        return () => subscribe();
    }, []);
    const renderItem = ({ item }: { item: { title: string; id: string } }) => {
        const ref = doc(FIREBASE_DB, "journal", item.id);

        const deleteJournal = () => {
            deleteDoc(ref);
        };

        return <JournalItem item={item} deleteJournal={deleteJournal} />;
    };
    return (
        <View className="flex-1 bg-[#141439]  items-center justify-center relative px-4">
            <View className="flex flex-col  ">
                <FlatList
                    data={journals}
                    renderItem={renderItem}
                    keyExtractor={(journal: Journal) => journal.id}
                />
            </View>
            {/* bottom gradient */}
            <View className=" w-full absolute bottom-0 h-32 ">
                <LinearGradient
                    style={{ position: "absolute", width: "100%", height: "100%" }}
                    colors={["rgba(0,0,0,0.0)", "rgba(20, 20, 56, 0.5)", "#141438"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                />
            </View>
        </View>
    );
};

export default List;
