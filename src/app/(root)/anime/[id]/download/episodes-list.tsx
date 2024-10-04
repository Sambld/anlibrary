import { Accordion, AccordionTrigger } from "@/components/ui/accordion";
import {
  getAnimeBatches,
  getAnimeEpisodesByReleasers,
} from "@/lib/nyaa/scrapper";

import React from "react";
import { releasers } from "@/constants/consts";
import AccordionDownloadItem from "@/components/anime-download/accordion-download-item";
import { NyaaEpisode } from "@/lib/nyaa/types";

export const dynamic = "force-dynamic";

type EpisodesListProps = {
  animeId: number;
  animeTitle: string;
  englishTitle: string;
  airing: boolean;
};

const EpisodesList = async ({
  animeId,
  animeTitle,
  englishTitle,
  airing,
}: EpisodesListProps) => {
  let releasersEpisodes: { [key: string]: NyaaEpisode[] } | null = null;
  let batches: NyaaEpisode[] = [];
  if (airing) {
    releasersEpisodes = await getAnimeEpisodesByReleasers({
      animeName: {
        english: englishTitle,
        japanese: animeTitle,
      },
      releasers: releasers,
    });
  } else {
    batches = await getAnimeBatches({
      animeTitle: {
        english: englishTitle,
        japanese: animeTitle,
      },
    });
  }
  const releaserKeys = releasersEpisodes ? Object.keys(releasersEpisodes) : [];

  // console.log(releasersEpisodes, batches);

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
            <AccordionDownloadItem animeTitle={animeTitle} items={batches}>
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
                  animeTitle={animeTitle}
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
