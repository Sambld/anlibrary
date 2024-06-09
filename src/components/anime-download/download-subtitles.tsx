"use client";
import React from "react";
import { Button } from "../ui/button";
import { downloadSubtitles } from "@/lib/download/actions";

const DownlaodSubtitles = () => {
  const handleClick = async () => {
    console.log("clicked");
    const subs = await downloadSubtitles(
      "https://subdl.com/subtitle/sd1300013/that-time-i-got-reincarnated-as-a-slime/third-season"
    );
    console.log(subs);
  };
  return (
    <div className="">
      <Button
        onClick={handleClick}
        variant={"ghost"}
        className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600"
      ></Button>
    </div>
  );
};

export default DownlaodSubtitles;
