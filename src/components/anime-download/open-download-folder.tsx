"use client";
import React from "react";
import { Button } from "../ui/button";
import { Folder } from "lucide-react";
import { downloadSubtitles, openFolder } from "@/lib/download/actions";

const OpenDownloadFolder = ({ title }: { title: string }) => {
  const handleOpenFolder = async () => {
    await openFolder(title);
  };

  // const handleSubtitlesDownload = async () => {
  //   const response = await downloadSubtitles(
  //     "https://subdl.com/subtitle/sd1300013/that-time-i-got-reincarnated-as-a-slime/third-season/arabic"
  //   );
  // };
  return (
    <div>
      <Button
        // onClick={handleOpenFolder}
        onClick={handleOpenFolder}
        className="bg-yellow-400 hover:bg-yellow-300 text-black "
      >
        <Folder size={24} />
      </Button>
    </div>
  );
};

export default OpenDownloadFolder;
