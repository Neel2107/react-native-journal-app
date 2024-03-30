import { supabase } from "./supabase";

export const createJournal = async (
  date: string,
  post_title: string,
  post_content: string,
  post_mood: string
): Promise<any> => {

  console.log("date", date, "post_title", post_title, "post_content", post_content, "post_mood", post_mood);
  const { data, error } = await supabase.from("posts").insert([
    {
      journal_date: date,
      journal_title: post_title,
      journal_content: post_content,
      journal_mood: post_mood,
    },
  ]);

  if (error) {
    console.error(error);
    throw error;
  }
  return data;
};

export const getJournal = async (id: string) => {

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw error;
  }
  return data;
}


//write updateJournal function here
export const updateJournal = async (
  id: string,
  date: string,
  post_title: string,
  post_content: string,
  post_mood: string
): Promise<any> => {
  const { data, error } = await supabase
    .from("posts")
    .update({
      journal_date: date,
      journal_title: post_title,
      journal_content: post_content,
      journal_mood: post_mood,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    throw error;
  }
  return data;
};



// postHelpers.ts
export const getPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("journal_date", { ascending: false }); 

  if (error) {
    console.error(error);
    throw error;
  }
  return data;
};



export const deleteJoural = async (id: string) => {
  console.log("deleting id", id);
  const { data, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
}