import { getFullAnimeById } from "@/lib/jikan_api/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getAnimeEpisodesByReleaser,
  getAnimeEpisodesByReleasers,
} from "@/lib/nyaa/scrapper";
import Image from "next/image";
import { InformationItem } from "@/components/information-item";
import { Badge } from "@/components/ui/badge";
import {
  ArrowBigDown,
  ArrowBigUp,
  ArrowUp,
  Download,
  Magnet,
} from "lucide-react";
import { isToday, isYesterday } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

import React from "react";
import { NYAA_BASE_URL, releasers } from "@/constants/consts";

type EpisodesListProps = {
  animeTitle: string;
};

const EpisodesList = async ({ animeTitle }: EpisodesListProps) => {
  const releasersEpisodes = await getAnimeEpisodesByReleasers({
    animeName: animeTitle,
    releasers: releasers,
  });

  const releaserKeys = releasersEpisodes ? Object.keys(releasersEpisodes) : [];
  return (
    <div>
      <div>
        <Accordion type="single" collapsible className="max-w-full">
          {releaserKeys.map((releaser, index) => (
            <div key={releaser + index}>
              {releasersEpisodes &&
                releasersEpisodes[releaser] &&
                releasersEpisodes[releaser].length > 0 && (
                  <AccordionItem value={`item-${index}`} className="mb-3">
                    <AccordionTrigger className="px-3 bg-secondary">
                      <a href={`#${releaser}`}>
                        {releaser}
                        <span className="text-xs ml-3">
                          ({releasersEpisodes[releaser].length} ep)
                        </span>
                      </a>
                    </AccordionTrigger>
                    <AccordionContent className={`${releaser}`}>
                      {
                        <ScrollArea>
                          <div className="max-h-[400px]">
                            <Table className="overflow-auto">
                              <TableCaption>
                                {releasersEpisodes[releaser].length} episodes
                              </TableCaption>
                              <TableHeader className="sticky top-0 bg-secondary ">
                                <TableRow className="border-green-300 border-b-2 ">
                                  <TableHead>Title</TableHead>
                                  <TableHead>Size</TableHead>
                                  <TableHead className="max-lg:hidden">
                                    <div className="flex items-center">
                                      <span> Seeders</span>
                                      <ArrowBigUp
                                        stroke="none"
                                        size={20}
                                        className="fill-green-500 inline"
                                      />
                                    </div>
                                  </TableHead>
                                  <TableHead className="max-lg:hidden">
                                    <div className="flex items-center">
                                      <span>Leechers</span>
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
                                {releasersEpisodes[releaser].map((episode) => (
                                  <TableRow key={episode.title}>
                                    <TableCell className="max-sm:text-xs">
                                      {episode.title}
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
                                        <Badge className="bg-green-600 hover:bg-green-700  text-xs text-zinc-50 max-sm:px-2 px-4">
                                          <span className="max-sm:text-[8px]">
                                            Today
                                          </span>
                                        </Badge>
                                      ) : isYesterday(
                                          new Date(episode.date)
                                        ) ? (
                                        <Badge className="bg-yellow-600 hover:bg-yellow-700  text-zinc-50 max-sm:px-2 px-4">
                                          <span className="max-sm:text-[8px]">
                                            Yesterday
                                          </span>
                                        </Badge>
                                      ) : (
                                        episode.date
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-1 max-sm:flex-col">
                                        <a
                                          href={`${NYAA_BASE_URL}${episode.torrentFile}`}
                                          className="text-blue-600"
                                        >
                                          <Download
                                            stroke="none"
                                            size={20}
                                            className="fill-blue-600"
                                          />
                                        </a>
                                        <a
                                          href={episode.magnet}
                                          className="text-blue-600"
                                        >
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
                      }
                    </AccordionContent>
                  </AccordionItem>
                )}
            </div>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default EpisodesList;
