import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import { formatAndDivideNumber } from "@/lib/utils";
import { getFullAnimeById } from "@/lib/jikan_api/api";
import {
  ArrowDownRight,
  ArrowUpRight,
  CirclePlay,
  Library,
  Play,
  PlayCircleIcon,
  Skull,
  Video,
  Videotape,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { InformationItem } from "@/components/information-item";
import DownloadButton from "@/components/download-button";
import { isAnimeInLibrary } from "@/lib/library";
import AddAnime from "@/components/anime-page/add-to-library";
import OpenInNyaa from "@/components/anime-page/open-in-nyaa";
import EpisodeBroadcastCountDown from "@/components/today-animes/episode-broadcast-countdown";

const AnimePage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const anime = await getFullAnimeById(id);

  const {
    title,
    title_english,
    title_japanese,
    episodes,
    images,
    genres,
    score,
    rank,
    type,
    rating,
    status,
    airing,
    url,
    aired,
    year,
    season,
    broadcast,
    studios,
    producers,
    source,
    members,
    trailer,
    synopsis,
    duration,
    title_synonyms,
    streaming,
    relations,
  } = anime.data;

  const { isInLibrary } = await isAnimeInLibrary(parseInt(id));
  return (
    <div className="flex flex-col gap-2 p-10 max-sm:p-2 max-sm:m-2  max-sm:mb-12">
      <div className="flex gap-5 w-full max-lg:flex-col max-lg:items-center">
        {/* /////////////////image/////////////////////////// */}
        <div className="flex flex-col justify-between">
          <Image
            placeholder="empty"
            src={images.webp.large_image_url}
            width={230}
            height={400}
            alt="anime"
            className=" max-h-[400px] rounded-lg object-cover"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-4">
                <Video size={24} className="mr-2" />
                Trailer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[712px] py-10 w-full">
              <iframe
                src={trailer.embed_url!}
                width="100%"
                height="315"
                allowFullScreen
              ></iframe>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex w-full items-start gap-5 flex-col ">
          {/* ////////////////Title with score and streaming services///////////////////////////// */}
          <div className="flex gap-10 max-lg:flex-col max-lg:items-start  items-center">
            <h1 className="text-2xl">{title_english || title}</h1>
            <div className="flex gap-5">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-fit flex items-center">
                  <CirclePlay className="text-blue-500" size={22} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {streaming.map((stream) => (
                    <DropdownMenuItem key={stream.name}>
                      <a href={stream.url} target="_blank">
                        {stream.name}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <a href={url} target="_blank">
                <Image
                  src={"/assets/myanimelist.svg"}
                  width={26}
                  height={26}
                  alt="mal-icon"
                  className="inline-block mr-2"
                />
              </a>

              <div>
                <span className="text-lg font-semibold">{score || "?"} </span>{" "}
                <span>/</span> <span className="text-sm"> 10</span>
                <span className="text-gray-500 ml-4">Rank #{rank}</span>
              </div>
            </div>
          </div>

          {/* ////////////////Infromations///////////////////////////// */}
          <div className="w-full max-md:flex-col max-md:gap-2   h-full flex ">
            <div className="flex flex-col max-md:justify-between gap-2 max-md:w-full  w-1/2">
              {/* //////////////// japanese title //////////////////// */}

              <InformationItem type="Japanese Title" value={title_japanese} />

              {/* //////////////// Genres //////////////////// */}

              <InformationItem type="Genres">
                <div className="flex gap-2 flex-wrap">
                  {genres.map((genre) => (
                    <a
                      key={genre.mal_id}
                      target="_blank"
                      href={`https://myanimelist.net/anime/genre/${genre.mal_id}`}
                    >
                      <Badge key={genre.mal_id}>{genre.name}</Badge>
                    </a>
                  ))}
                </div>
              </InformationItem>

              {/* //////////////// Episodes //////////////////// */}

              <InformationItem type="Episodes" value={episodes || status} />

              {/* //////////////// type //////////////////// */}
              <InformationItem type="Type" value={type} />

              {/* //////////////// rating //////////////////// */}
              <InformationItem type="Rating" value={rating} />

              {/* //////////////// Aired //////////////////// */}
              <InformationItem type="Aired" value={aired.string} />

              {/* //////////////// duration //////////////////// */}
              <InformationItem type="Duration" value={duration} />
            </div>
            {/* <Separator orientation="vertical" className="max-md:hidden" /> */}
            <div className="self-start h-full flex flex-col gap-3 max-md:w-full w-1/2 md:ml-4">
              {/* //////////////// members //////////////////// */}
              <InformationItem
                type="Members"
                value={formatAndDivideNumber(members)}
              />

              {/* //////////////// Broadcast //////////////////// */}
              <InformationItem type="Broadcast" value={broadcast.string} />
              {/* //////////////// premiered //////////////////// */}
              <InformationItem type="Premiered" value={`${season} ${year}`} />

              {/* //////////////// status //////////////////// */}
              <InformationItem type="Status" value={status} />
              {/* studios */}
              <InformationItem type="Studios">
                <div className="flex gap-2 flex-wrap">
                  {studios.map((studio) => (
                    <a
                      key={studio.mal_id}
                      target="_blank"
                      href={`https://myanimelist.net/anime/producer/${studio.mal_id}`}
                    >
                      <Badge key={studio.mal_id}>{studio.name}</Badge>
                    </a>
                  ))}
                </div>
              </InformationItem>

              {/* producers */}
              <InformationItem type="Producers">
                <div className="flex gap-2 flex-wrap">
                  {producers.map((producer) => (
                    <a
                      key={producer.mal_id}
                      target="_blank"
                      href={`https://myanimelist.net/anime/producer/${producer.mal_id}`}
                    >
                      <Badge key={producer.mal_id}>{producer.name}</Badge>
                    </a>
                  ))}
                </div>
              </InformationItem>

              {/* source */}
              <InformationItem type="Source" value={source} />
            </div>
          </div>
          {/* {airing && 
            <EpisodeBroadcastCountDown broadcast={broadcast}  />} */}
          {/* /////////////////// links and library/////////////// */}
          <div className="flex gap-3 flex-wrap">
            <Link href={`/anime/${id}/download`}>
              <DownloadButton />
            </Link>
            <AddAnime
              animeId={parseInt(id)}
              isInLibrary={isInLibrary || false}
            />
            <OpenInNyaa
              title={title}
              title_english={title_english}
              title_synonyms={title_synonyms}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <h1 className=" inline-block text-xl font-semibold border-l-teal-500 pl-4 border-l-4">
          Synopsis
        </h1>
        <p>{synopsis}</p>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <h1 className="mt-4 inline-block text-xl font-semibold border-l-teal-500 pl-4 border-l-4">
          Relations
        </h1>
        <div>
          <Separator />

          {relations.map((relation) => (
            <div key={relation.relation + relation.entry}>
              <div className="flex gap-4 items-start mt-5">
                <span className="text-sm text-gray-500 min-w-[80px]">
                  {relation.relation}
                </span>
                <div className="flex flex-col gap-2">
                  {relation.entry.map((entry) => (
                    <Link
                      key={entry.mal_id}
                      href={`/anime/${entry.mal_id}`}
                      className="text-xs"
                    >
                      {entry.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimePage;
