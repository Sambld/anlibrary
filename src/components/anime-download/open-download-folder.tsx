"use client";
import React from "react";
import { Button } from "../ui/button";
import { Folder } from "lucide-react";
import { downloadSubtitles, openFolder } from "@/lib/download/actions";

const OpenDownloadFolder = ({ id }: { id: number }) => {
  const handleOpenFolder = async () => {
    await openFolder(id);
  };

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
