"use client";
import { Broadcast } from "@/lib/jikan_api/types";
import { getNextBroadcastDate, getDateDifference, convertToUTCTimeZone } from "@/lib/utils";
import React, { useState, useEffect, useCallback } from "react";

type EpisodeBroadcastCountDownProps = {
  broadcast: {
    day?: string;
    time?: string;
  };
};

const EpisodeBroadcastCountDown = ({
  broadcast
}: EpisodeBroadcastCountDownProps) => {
  const [timeDiff, setTimeDiff] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const updateTimeDiff = useCallback(() => {
    const now = new Date();
    const nowInAsiaTokyo = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
    );
    if (!broadcast.day) {
      return setTimeDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
    const nextBroadcastInAsiaTokyo = getNextBroadcastDate(
      broadcast.day.slice(0, -1),
      broadcast.time || "00:00"
    );
    // const {date} = convertToUTCTimeZone({dayOfWeek: broadcast.day, time: broadcast.time})

    // console.log('now : ', now);
    // console.log("date : ", date);
    
    // console.log(date)
    const { days, hours, minutes, seconds } = getDateDifference(
      nowInAsiaTokyo,
      nextBroadcastInAsiaTokyo
    );
  console.log(days, hours, minutes, seconds);

    setTimeDiff({ days, hours, minutes, seconds });
  }, [broadcast.day, broadcast.time]);

  useEffect(() => {
    const interval = setInterval(updateTimeDiff, 5000);
    return () => clearInterval(interval);
  }, [updateTimeDiff]);

  return (
    <div>
      <p className="max-sm:text-sm text-sm">
        New Episode in:
        {"  "}
        <span className="text-[14px] font-semibold">
          {timeDiff.days}d {timeDiff.hours}h {timeDiff.minutes}m{" "}
          {timeDiff.seconds}s
        </span>
      </p>
    </div>
  );
};

export default EpisodeBroadcastCountDown;
