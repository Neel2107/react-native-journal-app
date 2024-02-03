
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
    const ampm: string = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    // Use a template literal or a separate variable to format minutes with a leading zero
    const formattedMinutes: string = minutes < 10 ? `0${minutes}` : minutes.toString();
  
    // Now, use `formattedMinutes` for the minute part of the time
    const formattedTime: string = `${hours}:${formattedMinutes} ${ampm}`;
    return formattedTime;
  }
  
export function getTodaysDate(): string {
    const now: Date = new Date();
    const month: string = (`0${now.getMonth() + 1}`).slice(-2); // Months are 0-indexed, add 1 to get the correct month
    const day: string = (`0${now.getDate()}`).slice(-2); // Add leading zero if necessary
    const year: number = now.getFullYear();
  
    return `${month}/${day}/${year}`;
  }
  
    
  