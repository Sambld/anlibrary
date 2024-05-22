import { getFullAnimeById } from "@/lib/myanimelist_api/api";
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
} from "@/lib/myanimelist_api/nyaa/scrapper";
import React from "react";
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
import { NYAA_BASE_URL } from "@/constants/consts";

const DownloadPage = async ({ params }: { params: { id: string } }) => {
  const anime = await getFullAnimeById(params.id);
  console.log(anime.data.title);
  const releasersEpisodes = await getAnimeEpisodesByReleasers({
    animeName: anime.data.title,
    releasers: ["[ASW]", "[EMBER]", "[SubsPlease]", "[Erai-raws]"],
  });

  const releaserKeys = releasersEpisodes ? Object.keys(releasersEpisodes) : [];
  console.log(releaserKeys);
  return (
    <div className="p-10">
      <div className="flex h-[230px] gap-5">
        <Image
          src={anime.data.images.webp.large_image_url}
          width={150}
          height={230}
          alt="anime image"
          className="rounded-md object-cover "
        />
        <div className="flex flex-col gap-5">
          <h1 className="text-xl font-bold">{anime.data.title}</h1>
          <InformationItem type="status">
            {anime.data.status === "Currently Airing" ? (
              <>
                <Badge className="bg-green-600 hover:bg-green-700 text-zinc-50 px-4">
                  Airing
                </Badge>
              </>
            ) : (
              anime.data.status
            )}
          </InformationItem>
          <InformationItem type="score" value={anime.data.score} />
          <InformationItem type="Episodes" value={anime.data.episodes || "?"} />

          <InformationItem type="type" value={anime.data.type} />
        </div>
      </div>

      <div className="p-5">filters</div>

      <div>
        <div>
          <Accordion type="single" collapsible className="w-full">
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
                          <ScrollArea className="h-96">
                            <Table>
                              <TableCaption>
                                {releasersEpisodes[releaser].length} episodes
                              </TableCaption>
                              <TableHeader className="sticky top-0 bg-secondary ">
                                <TableRow>
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
                              <TableBody className=" overflow-hidden h-92 ">
                                {releasersEpisodes[releaser].map((episode) => (
                                  <TableRow key={episode.title}>
                                    <TableCell>{episode.title}</TableCell>
                                    <TableCell>{episode.size}</TableCell>
                                    <TableCell className="text-green-600 max-lg:hidden">
                                      {episode.seeders}
                                    </TableCell>
                                    <TableCell className="text-red-600  max-lg:hidden">
                                      {episode.leechers}
                                    </TableCell>
                                    <TableCell>
                                      {isToday(new Date(episode.date)) ? (
                                        <Badge className="bg-green-600 hover:bg-green-700 text-zinc-50 px-4">
                                          Today
                                        </Badge>
                                      ) : isYesterday(
                                          new Date(episode.date)
                                        ) ? (
                                        <Badge className="bg-yellow-600 hover:bg-yellow-700 text-zinc-50 px-4">
                                          Yesterday
                                        </Badge>
                                      ) : (
                                        episode.date
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-1">
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
    </div>
  );
};

export default DownloadPage;
