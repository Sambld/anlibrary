"use client";
import { NYAA_BASE_URL } from "@/constants/consts";
import { isToday, isYesterday } from "@/lib/utils";
import {
  ArrowBigUp,
  ArrowBigDown,
  Download,
  Magnet,
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
              <TableHeader className="sticky top-0 bg-secondary ">
                <TableRow className="border-green-300 border-b-2 ">
                  <TableHead>Title</TableHead>
                  <TableHead>Download</TableHead>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((episode) => (
                  <TableRow key={episode.title}>
                    <TableCell className="max-sm:text-xs">
                      <a className="hover:underline" href={episode.url} target="_blank" rel="noopener noreferrer">{episode.title}</a>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 max-sm:flex-col">
                        {/* <a href={`${NYAA_BASE_URL}${episode.torrentFile}`}>
                          <Download
                            size={20}
                            className="text-blue-600 cursor-pointer"
                          />
                        </a> */}
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger>
                              <TorrentDownloader
                                magnetUrl={episode.magnet}
                                animeTitle={animeTitle}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Spawn Qbittorrent download </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <a href={episode.magnet}>
                          <Magnet
                            size={20}
                            className="text-blue-600 cursor-pointer"
                          />
                        </a>

                      </div>
                    </TableCell>
                    <TableCell className="max-sm:text-xs">
                      {episode.size}
                    </TableCell>
                    <TableCell className="text-green-600 max-lg:hidden">
                      {episode.seeders}
                    </TableCell>
                    <TableCell className="text-red-600  max-lg:hidden">
                      {episode.leechers}
                    </TableCell>
                    <TableCell>
                      {isToday(new Date(episode.date)) ? (
                        <Badge className="bg-green-600 hover:bg-green-700 text-xs text-zinc-50 max-sm:px-2 px-4 ">
                          <span className="max-sm:text-[8px]">Today</span>                      
                        </Badge>

                      ) : isYesterday(new Date(episode.date)) ? (
                        <Badge className="bg-yellow-600 hover:bg-yellow-700  text-zinc-50 max-sm:px-2 px-4">
                          <span className="max-sm:text-[8px]">Yesterday</span>
                        </Badge>
                      ) : (
                        episode.date
                      )}
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
