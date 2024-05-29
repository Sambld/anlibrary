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
import React, { Suspense } from "react";
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
import { NYAA_BASE_URL, releasers } from "@/constants/consts";
import EpisodesList from "./episodes-list";
import LoadingInfinity from "@/components/loading-infinity";
import Link from "next/link";

const DownloadPage = async ({ params }: { params: { id: string } }) => {
  const anime = await getFullAnimeById(params.id);
  console.log(anime.data);

  return (
    <div className="max-sm:p-5 p-10 mb-12 ">
      <div className="flex gap-5 max-sm:flex-col">
        <Image
          src={anime.data.images.webp.large_image_url}
          width={150}
          height={230}
          alt="anime image"
          className="rounded-md object-cover text-center"
        />
        <div className="flex flex-col gap-5 ">
          <Link href={`/anime/${anime.data.mal_id}`}>
            <h1 className="text-xl font-bold hover:underline">
              {anime.data.title}
            </h1>
          </Link>
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

      {/* <div className="p-5">filters</div> */}

      <Suspense fallback={<LoadingInfinity />}>
        <EpisodesList
          animeTitle={anime.data.title}
          englishTitle={anime.data.title_english}
          airing={anime.data.airing}
        />
      </Suspense>
    </div>
  );
};

export default DownloadPage;
