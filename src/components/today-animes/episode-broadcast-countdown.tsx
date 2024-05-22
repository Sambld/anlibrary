"use client";
import { getNextBroadcastDate, getDateDifference } from "@/lib/utils";
import React, { useState, useEffect, useCallback } from "react";

type EpisodeBroadcastCountDownProps = {
  broadcast: { day: string; time: string; timezone: string };
};

const EpisodeBroadcastCountDown = ({
  broadcast,
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
    const nextBroadcastInAsiaTokyo = getNextBroadcastDate(
      broadcast.day.slice(0, -1),
      broadcast.time
    );
    const { days, hours, minutes, seconds } = getDateDifference(
      nowInAsiaTokyo,
      nextBroadcastInAsiaTokyo
    );
    setTimeDiff({ days, hours, minutes, seconds });
  }, [broadcast.day, broadcast.time]);

  useEffect(() => {
    const interval = setInterval(updateTimeDiff, 1000);
    return () => clearInterval(interval);
  }, [updateTimeDiff]);

  return (
    <div>
      <p>
        New Episode in: {timeDiff.days}d {timeDiff.hours}h {timeDiff.minutes}m{" "}
        {timeDiff.seconds}s
      </p>
    </div>
  );
};

export default EpisodeBroadcastCountDown;
