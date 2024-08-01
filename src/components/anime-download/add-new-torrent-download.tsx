"use client";

import React, { useState } from "react";
import { MonitorDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addTorrent } from "@/lib/download/actions";
import { toast } from "../ui/use-toast";

const speedOptions = [
  { label: "150 KB/s", value: 153600 },
  { label: "300 KB/s", value: 307200 },
  { label: "500 KB/s", value: 512000 },
];

interface TorrentDownloaderProps {
  magnetUrl: string;
  animeId: number;
}

export default function TorrentDownloader({
  magnetUrl,
  animeId,
}: TorrentDownloaderProps) {
  const [selectedSpeed, setSelectedSpeed] = useState<number | null>(null);
  const [customSpeed, setCustomSpeed] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleSpeedSelect = (speed: number) => {
    if (selectedSpeed === speed) setSelectedSpeed(null);
    else setSelectedSpeed(speed);

    setCustomSpeed(0);
  };

  const handleCustomSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setCustomSpeed(0);
    } else {
      setCustomSpeed(parseInt(value));
    }
    setSelectedSpeed(null);
  };

  const handleAddTorrent = async () => {
    const speed = selectedSpeed || customSpeed * 1024;
    const response = await addTorrent({
      magnetUrl,
      downloadSpeed: speed || 0,
      animeId,
    });

    if (response.success) {
      toast({
        description: response.message,
        duration: 1000,
      });
    }
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <MonitorDown size={20} className="cursor-pointer text-blue-600" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="left"
        className="w-64 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Download Speed</Label>
            <div className="mt-2 flex gap-2">
              {speedOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    selectedSpeed === option.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleSpeedSelect(option.value)}
                  className="text-xs px-2"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            {/* max speed button */}
            <Button
              variant={selectedSpeed === 0 ? "default" : "outline"}
              size="sm"
              onClick={() => handleSpeedSelect(0)}
              className="text-xs px-2 w-full mt-2"
            >
              Max
            </Button>
          </div>
          <div>
            <Label htmlFor="custom-speed" className="text-sm font-medium">
              Custom Speed
            </Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="custom-speed"
                type="number"
                value={customSpeed?.toString() || ""}
                onChange={handleCustomSpeedChange}
                placeholder="Custom KB/s"
                className="flex-grow"
                step="50"
              />
              <span className="text-sm">KB/s</span>
            </div>
          </div>
          <Button
            onClick={handleAddTorrent}
            disabled={selectedSpeed === null && !customSpeed}
            className="w-full"
          >
            Start Download
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
