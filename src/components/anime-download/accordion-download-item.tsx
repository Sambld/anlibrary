import { NYAA_BASE_URL } from "@/constants/consts";
import { isToday, isYesterday } from "@/lib/utils";
import { ArrowBigUp, ArrowBigDown, Download, Magnet } from "lucide-react";
import React from "react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
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

type DownloadAccodionProps = {
  children: React.ReactNode;
  items: NyaaEpisode[];
  valueKey?: number;
};
const AccordionDownloadItem = ({
  children,
  items,
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
                  <TableRow key={batch.title + batch.size}>
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
                        <a
                          href={`${NYAA_BASE_URL}${batch.torrentFile}`}
                          className="text-blue-600"
                        >
                          <Download
                            stroke="none"
                            size={20}
                            className="fill-blue-600"
                          />
                        </a>
                        <a href={batch.magnet} className="text-blue-600">
                          <Magnet
                            stroke="none"
                            size={20}
                            className="fill-blue-600"
                          />
                        </a>
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
