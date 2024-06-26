export const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  } else {
    return text;
  }
};

export function getCurrentTime(): string {
  const now: Date = new Date();
  let hours: number = now.getHours();
  let minutes: number = now.getMinutes();
  const ampm: string = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Use a template literal or a separate variable to format minutes with a leading zero
  const formattedMinutes: string =
    minutes < 10 ? `0${minutes}` : minutes.toString();

  // Now, use `formattedMinutes` for the minute part of the time
  const formattedTime: string = `${hours}:${formattedMinutes} ${ampm}`;
  return formattedTime;
}

export function getTodaysDate(): string {
  const now: Date = new Date();
  return now.toISOString();
}
export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date(now.setDate(now.getDate() - 1));
  now.setDate(now.getDate() + 1); // Reset to today's date

  // Format date as 'Today' or 'Yesterday' if applicable, otherwise as DD/MM/YYYY
  let formattedDate;
  if (date.toDateString() === now.toDateString()) {
    formattedDate = "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    formattedDate = "Yesterday";
  } else {
    formattedDate = date.toLocaleDateString("en-GB");
  }

  const formattedTime = date
    .toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();
  return { formattedDate, formattedTime };
};

export const moods = [
  { id: 1, emoji: "😁" },
  { id: 2, emoji: "😢" },
  { id: 3, emoji: "😕" },
  { id: 4, emoji: "😐" },
  { id: 5, emoji: "🙂" },
  { id: 6, emoji: "😀" },
  { id: 7, emoji: "😭" }
];
