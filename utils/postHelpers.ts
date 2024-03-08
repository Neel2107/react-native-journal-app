import { supabase } from "./supabase";

export const createPost = async (
  post_title: string,
  post_content: string,
  post_mood: string
): Promise<any> => {
  const { data, error } = await supabase.from("posts").insert([
    {
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
