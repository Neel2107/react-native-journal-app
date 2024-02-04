import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebase';

// Define a type for your journal state to let TypeScript know what to expect
type JournalType = {
  id: string;
  title: string;
  journal: string;
  // Add any other properties that your journal may have
};

const ReadJournal = () => {
  const [journal, setJournal] = useState<JournalType | null>(null);
  const [loading, setLoading] = useState(true);
  const pathName = usePathname(); // Assuming this gives something like '/journals/{journalId}'

  useEffect(() => {
    const fetchJournal = async () => {
      // Extract the journal ID from the router path
      const segments = pathName.split('/'); // Split pathName into segments
      const journalId = segments[segments.length - 1]; // Assuming the last segment is the journalId
      console.log("Journal ID extracted:", journalId);

      if (journalId) {
        try {
          const docRef = doc(FIREBASE_DB, "journal", journalId);
          const docSnap = await getDoc(docRef);
      
          if (docSnap.exists()) {
            setJournal({ id: docSnap.id, ...docSnap.data() } as JournalType);
          } else {
            console.log(`No such document with ID ${journalId}!`);
          }
        } catch (error) {
          console.error("Error fetching journal:", error);
          alert(`Error fetching journal: ${(error as any).message}`);
        }
      }
      
      
      setLoading(false);
    };

    fetchJournal();
  }, [pathName]); // Depend on pathName to re-fetch if it changes

  if (loading) {
    return <ActivityIndicator className='flex-1 bg-[#141438]' color={'#fff'}  size={50}/>;
  }

  if (!journal) {
    return (
      <View className='flex-1 bg-[#141438] px-4'>
        <Text>No journal found.</Text>
      </View>
    );
  }

  // Once the journal is fetched, display its details
  console.log(journal);
  
  return (
    <View className='flex-1 bg-[#141438] px-4'>
      <Text className='text-xl font-bold text-[#e5e1ff]'>{journal?.title}</Text>
      <Text className='text-[#e5e1ff]'>{journal?.journal}</Text>
    </View>
  );
};

export default ReadJournal;
