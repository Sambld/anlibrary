import { getFullAnimeById } from "@/lib/jikan_api/api";
import React, { Suspense } from "react";
import Image from "next/image";
import { InformationItem } from "@/components/information-item";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import EpisodesList from "./episodes-list";
import LoadingInfinity from "@/components/loading-infinity";
import Link from "next/link";
import OpenInNyaa from "@/components/anime-page/open-in-nyaa";
import { Button } from "@/components/ui/button";
import EpisodeBroadcastCountDown from "@/components/today-animes/episode-broadcast-countdown";
import OpenDownloadFolder from "@/components/anime-download/open-download-folder";
import { getAnimeFromLibrary, isAnimeInLibrary } from "@/lib/library";
import SetReleaseDay from "@/components/anime-download/set-anime-release-day";

export const dynamic = "force-dynamic";

const DownloadPage = async ({ params }: { params: { id: string } }) => {
  const anime = await getFullAnimeById(params.id);
  const animeFromLibrary = await getAnimeFromLibrary(parseInt(params.id));
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

          {/* <EpisodeBroadcastCountDown broadcast={anime.data.broadcast} /> */}
        </div>
      </div>

      {/* <div className="p-5">filters</div> */}
      <div className="mt-4 flex gap-4 flex-wrap">
        <OpenInNyaa
          title={anime.data.title}
          title_english={anime.data.title_english}
          title_synonyms={[]}
        />
        {
          <a
            href={
              animeFromLibrary?.anime?.subtitlesLink ||
              `https://subdl.com/search/${anime.data.title}`
            }
            target="_blank"
          >
            <Button className="bg-yellow-400 hover:bg-yellow-300 text-black ">
              <Download size={24} className="mr-2" />
              Download Subtitles
            </Button>
          </a>
        }
        <OpenDownloadFolder id={anime.data.mal_id} />

        {animeFromLibrary && (
          <SetReleaseDay
            defaultDay={animeFromLibrary?.anime?.broadcastDay}
            animeId={anime.data.mal_id}
          />
        )}
      </div>
      <Suspense fallback={<LoadingInfinity />}>
        <EpisodesList
          animeId={anime.data.mal_id}
          animeTitle={anime.data.title}
          englishTitle={anime.data.title_english}
          airing={anime.data.airing}
        />
      </Suspense>
    </div>
  );
};

export default DownloadPage;
