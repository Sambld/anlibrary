"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Assume this is imported from elsewhere
import { handleDaySelection } from "@/lib/download/actions";
import { CalendarDaysIcon } from "lucide-react";
import { toast } from "../ui/use-toast";

interface WeekdaySelectorProps {
  defaultDay?: string;
  animeId: number;
}

export default function WeekdaySelector({
  defaultDay,
  animeId,
}: WeekdaySelectorProps) {
  const [selectedDay, setSelectedDay] = React.useState<string | undefined>(
    defaultDay
  );

  const weekdays = [
    "saturday",
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ];

  const handleValueChange = async (day: string) => {
    setSelectedDay(day);
    if (day) {
      try {
        const response = await handleDaySelection(day, animeId);
        if (response.code === 200) {
          toast({
            style: {
              color: "#16a34a",
            },
            title: response.message,
            duration: 3000,
          });
        } else {
          toast({
            style: {
              color: "#e53e3e",
            },
            title: response.message,
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("Error handling day selection:", error);
      }
    }
  };

  React.useEffect(() => {
    if (defaultDay && defaultDay !== selectedDay) {
      handleValueChange(defaultDay);
    }
  }, [defaultDay]);

  return (
    <div>
      <Select value={selectedDay} onValueChange={handleValueChange}>
        <SelectTrigger className="bg-transparent">
          <CalendarDaysIcon size={20} className="mr-2" />
          <SelectValue placeholder="Select a day" className="ml-1" />
        </SelectTrigger>
        <SelectContent>
          {weekdays.map((day) => (
            <SelectItem key={day} value={day}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
