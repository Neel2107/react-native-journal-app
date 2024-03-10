import { supabase } from "./supabase";

export const createJournal = async (
  date: string,
  post_title: string,
  post_content: string,
  post_mood: string
): Promise<any> => {
  const { data, error } = await supabase.from("posts").insert([
    {
      created_at: date,
      post_title: post_title,
      post_content: post_content,
      post_mood: post_mood,
    },
  ]);

  if (error) {
    console.error(error);
    throw error;
  }
  return data;
};

//recent, oldest, a-z or z-a

// postHelpers.ts
export const getPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false }); 

  if (error) {
    console.error(error);
    throw error;
  }
  return data;
};
