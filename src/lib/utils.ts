import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000) {
    const formattedNum = (num / 1000000).toFixed(1);
    return `${formattedNum}M`;
  } else if (num >= 1000) {
    const formattedNum = (num / 1000).toFixed(1);
    return `${formattedNum}K`;
  } else {
    return num.toString();
  }
};

export function getNextBroadcastDate(
  day: string,
  time: string,
  timezone = "Asia/Tokyo"
) {
  // Create an array of days
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get the current date in the Asia/Tokyo timezone
  const now = new Date();
  const currentDate = new Date(
    now.toLocaleString("en-US", { timeZone: timezone })
  );

  // Parse the input time string into hours and minutes
  const [hours, minutes] = time.split(":").map(Number);

  // Get the index of the target day
  const targetDayIndex = days.indexOf(day);

  // Get the index of the current day
  const currentDayIndex = currentDate.getDay();

  // Calculate the number of days until the next target day
  let daysUntilNextBroadcast = (targetDayIndex - currentDayIndex + 7) % 7;

  // If the target day is today and the current time is after the broadcast time,
  // add 7 days to get the next week's target day
  if (
    daysUntilNextBroadcast === 0 &&
    (currentDate.getHours() > hours ||
      (currentDate.getHours() === hours && currentDate.getMinutes() >= minutes))
  ) {
    daysUntilNextBroadcast = 7;
  }

  // Add the number of days until the next target day to the current date
  const nextBroadcastDate = new Date(
    currentDate.getTime() + daysUntilNextBroadcast * 24 * 60 * 60 * 1000
  );

  // Set the hours and minutes of the next broadcast date
  nextBroadcastDate.setHours(hours);
  nextBroadcastDate.setMinutes(minutes);
  nextBroadcastDate.setSeconds(0);
  nextBroadcastDate.setMilliseconds(0);

  // Return the next broadcast date
  return nextBroadcastDate;
}

export function getDateDifference(date1: Date, date2: Date) {
  // Get the time difference in milliseconds
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());

  // Calculate the difference in days
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // Calculate the remaining hours
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  // Calculate the remaining minutes
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  // Calculate the remaining seconds
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

export const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isYesterday = (date: Date) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};
