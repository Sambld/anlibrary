"use client";
import { NYAA_BASE_URL } from "@/constants/consts";
import { isToday, isYesterday } from "@/lib/utils";
import {
  ArrowBigUp,
  ArrowBigDown,
  Download,
  Magnet,
  MonitorDownIcon,
} from "lucide-react";
import React from "react";
import { AccordionItem, AccordionContent } from "../ui/accordion";
import { ScrollArea } from "../ui/scroll-area";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { NyaaEpisode } from "@/lib/nyaa/types";
import { useToast } from "../ui/use-toast";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import TorrentDownloader from "./add-new-torrent-download";

type DownloadAccodionProps = {
  children: React.ReactNode;
  items: NyaaEpisode[];
  valueKey?: number;
  animeTitle: string;
};
const AccordionDownloadItem = ({
  children,
  items,
  animeTitle,
  valueKey = 0,
}: DownloadAccodionProps) => {
  return (
    <AccordionItem value={`item-${valueKey}`} className="mb-3">
      {children}
      <AccordionContent>
        <ScrollArea>
          <div className="max-h-[400px]">
            <Table className="overflow-auto">
              <TableCaption>{items.length} batch</TableCaption>
              <TableHeader className="sticky top-0 bg-secondary ">
                <TableRow className="border-green-300 border-b-2 ">
                  <TableHead>Title</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="max-lg:hidden">
                    <div className="flex items-center">
                      <span className="max-xl:hidden"> Seeders</span>
                      <ArrowBigUp
                        stroke="none"
                        size={20}
                        className="fill-green-500 inline"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="max-lg:hidden">
                    <div className="flex items-center">
                      <span className="max-xl:hidden">Leechers</span>
                      <ArrowBigDown
                        stroke="none"
                        size={20}
                        className="fill-red-500"
                      />
                    </div>
                  </TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Links</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((batch) => (
                  <TableRow key={batch.title}>
                    <TableCell className="max-sm:text-xs">
                      {batch.title}
                    </TableCell>
                    <TableCell className="max-sm:text-xs">
                      {batch.size}
                    </TableCell>
                    <TableCell className="text-green-600 max-lg:hidden">
                      {batch.seeders}
                    </TableCell>
                    <TableCell className="text-red-600  max-lg:hidden">
                      {batch.leechers}
                    </TableCell>
                    <TableCell>
                      {isToday(new Date(batch.date)) ? (
                        <Badge className="bg-green-600 hover:bg-green-700  text-xs text-zinc-50 max-sm:px-2 px-4">
                          <span className="max-sm:text-[8px]">Today</span>
                        </Badge>
                      ) : isYesterday(new Date(batch.date)) ? (
                        <Badge className="bg-yellow-600 hover:bg-yellow-700  text-zinc-50 max-sm:px-2 px-4">
                          <span className="max-sm:text-[8px]">Yesterday</span>
                        </Badge>
                      ) : (
                        batch.date
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 max-sm:flex-col">
                        <a href={`${NYAA_BASE_URL}${batch.torrentFile}`}>
                          <Download
                            size={20}
                            className="text-blue-600 cursor-pointer"
                          />
                        </a>
                        <a href={batch.magnet}>
                          <Magnet
                            size={20}
                            className="text-blue-600 cursor-pointer"
                          />
                        </a>

                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger>
                              <TorrentDownloader
                                magnetUrl={batch.magnet}
                                animeTitle={animeTitle}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Spawn Qbittorrent download </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  );
};

export default AccordionDownloadItem;
