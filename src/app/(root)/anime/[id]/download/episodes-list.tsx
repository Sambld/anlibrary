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
  getAnimeBatches,
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
import OpenInNyaa from "@/components/anime-page/open-in-nyaa";
import AccordionDownloadItem from "@/components/anime-download/accordion-download-item";
import { NyaaEpisode } from "@/lib/nyaa/types";
import { Button } from "@/components/ui/button";

type EpisodesListProps = {
  animeTitle: string;
  englishTitle: string;
  airing: boolean;
};

const EpisodesList = async ({
  animeTitle,
  englishTitle,
  airing,
}: EpisodesListProps) => {
  let releasersEpisodes: { [key: string]: NyaaEpisode[] } | undefined =
    undefined;
  if (airing) {
    releasersEpisodes = await getAnimeEpisodesByReleasers({
      animeName: {
        english: englishTitle,
        japanese: animeTitle,
      },
      releasers: releasers,
    });
  }

  const batches = await getAnimeBatches(animeTitle);

  const releaserKeys = releasersEpisodes ? Object.keys(releasersEpisodes) : [];
  return (
    <>
      {releaserKeys.length === 0 && batches.length === 0 && (
        <div className="relative flex flex-col justify-center items-center mt-20 gap-4 h-full">
          <p className="text-center">
            Nothing found for <span className="underline"> {animeTitle}</span>{" "}
            <br />
            Try searching with different titles or formats.
          </p>
        </div>
      )}
      <Accordion type="single" collapsible className="max-w-full mt-10">
        {batches && batches.length > 0 && (
          <>
            <AccordionDownloadItem items={batches}>
              <AccordionTrigger className="bg-crimson  px-4">
                <span className="text-white text-sm">
                  Batches & BDs
                  <span className="text-xs ml-3">({batches.length} batch)</span>
                </span>
              </AccordionTrigger>
            </AccordionDownloadItem>
          </>
        )}

        {releaserKeys.map((releaser, index) => (
          <div key={releaser + index}>
            {releasersEpisodes &&
              releasersEpisodes[releaser] &&
              releasersEpisodes[releaser].length > 0 && (
                <AccordionDownloadItem
                  items={releasersEpisodes[releaser]}
                  valueKey={index + 1}
                >
                  <AccordionTrigger className="p-[11px] px-3 bg-secondary">
                    <span className="text-sm">
                      {releaser}

                      <span className="text-xs ml-3">
                        ({releasersEpisodes[releaser].length} ep)
                      </span>
                    </span>
                  </AccordionTrigger>
                </AccordionDownloadItem>
              )}
          </div>
        ))}
      </Accordion>
    </>
  );
};

export default EpisodesList;
