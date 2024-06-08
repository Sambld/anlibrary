import { Accordion, AccordionTrigger } from "@/components/ui/accordion";
import {
  getAnimeBatches,
  getAnimeEpisodesByReleaser,
  getAnimeEpisodesByReleasers,
} from "@/lib/nyaa/scrapper";

import React from "react";
import { releasers } from "@/constants/consts";
import AccordionDownloadItem from "@/components/anime-download/accordion-download-item";
import { NyaaEpisode } from "@/lib/nyaa/types";

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
  let releasersEpisodes: { [key: string]: NyaaEpisode[] } | null = null;
  if (airing) {
    releasersEpisodes = await getAnimeEpisodesByReleasers({
      animeName: {
        default: englishTitle,
        english: animeTitle,
      },
      releasers: releasers,
    });
  }

  console.log(animeTitle);
  let batches: NyaaEpisode[] = [];
  if (!airing) {
    batches = await getAnimeBatches({
      animeTitle: {
        default: englishTitle,
        english: animeTitle,
      },
    });
  }
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

// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { Accordion, AccordionTrigger } from "@/components/ui/accordion";
// import AccordionDownloadItem from "@/components/anime-download/accordion-download-item";
// import { NyaaEpisode } from "@/lib/nyaa/types";
// import { set } from "zod";
// import LoadingInfinity from "@/components/loading-infinity";
// import FavouriteReleasers from "@/components/anime-download/fav-releasers";
// import { debounce } from "@/lib/utils";

// type EpisodesListProps = {
//   animeTitle: string;
//   englishTitle: string;
//   airing: boolean;
// };

// const EpisodesList: React.FC<EpisodesListProps> = ({
//   animeTitle,
//   englishTitle,
//   airing,
// }) => {
//   const [releasersEpisodes, setReleasersEpisodes] = useState<{
//     [key: string]: NyaaEpisode[];
//   } | null>(null);
//   const [batches, setBatches] = useState<NyaaEpisode[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [favouriteReleasers, setFavouriteReleasers] = useState<string[]>([]);

//   const fetchData = async () => {
//     try {
//       if (airing) {
//         const res = await fetch("/api/anime/123/download", {
//           body: JSON.stringify({
//             type: "episodes",
//             animeName: {
//               default: animeTitle,
//               engslish: englishTitle,
//             },
//             releasers: favouriteReleasers,
//           }),
//           method: "POST",
//         });

//         const { episodes } = await res.json();

//         setReleasersEpisodes(episodes);
//       }
//       const res = await fetch("/api/anime/123/download", {
//         body: JSON.stringify({
//           type: "batches",
//           animeName: {
//             default: animeTitle,
//             engslish: englishTitle,
//           },
//         }),
//         method: "POST",
//       });
//       const { batches } = await res.json();
//       setBatches(batches);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleFavouriteReleaser = (releaser: string) => {
//     const newFavouriteReleasers = [...favouriteReleasers];
//     const index = newFavouriteReleasers.indexOf(releaser);
//     if (index > -1) {
//       newFavouriteReleasers.splice(index, 1);
//     } else {
//       newFavouriteReleasers.push(releaser);
//     }
//     // write to local storage
//     localStorage.setItem(
//       "favourite_releasers",
//       JSON.stringify(newFavouriteReleasers)
//     );
//     setFavouriteReleasers(newFavouriteReleasers);
//     console.log("newFavouriteReleasers", newFavouriteReleasers);
//   };

//   useEffect(() => {
//     const storedFavouriteReleasers = localStorage.getItem(
//       "favourite_releasers"
//     );
//     if (storedFavouriteReleasers !== null) {
//       setFavouriteReleasers(JSON.parse(storedFavouriteReleasers));
//     } else {
//       setFavouriteReleasers(["[SubsPlease]"]);
//     }
//   }, []);

//   useEffect(
//     debounce(() => {
//       setLoading(true);
//       fetchData();
//     }, 500),
//     [favouriteReleasers]
//   );

//   const releaserKeys = releasersEpisodes ? Object.keys(releasersEpisodes) : [];

//   return (
//     <>
//       {airing && (
//         <FavouriteReleasers
//           toggleFavouriteReleaser={toggleFavouriteReleaser}
//           favourite_releasers={favouriteReleasers.join(",")}
//         />
//       )}

//       {loading && <LoadingInfinity className="mt-10" />}

//       {!loading && (
//         <>
//           {releaserKeys.length === 0 && batches.length === 0 && (
//             <div className="relative flex flex-col justify-center items-center mt-20 gap-4 h-full">
//               <p className="text-center">
//                 Nothing found for{" "}
//                 <span className="underline"> {animeTitle}</span> <br />
//                 Try searching with different titles or formats.
//               </p>
//             </div>
//           )}
//           <Accordion type="single" collapsible className="max-w-full mt-10">
//             {batches && batches.length > 0 && (
//               <>
//                 <AccordionDownloadItem items={batches}>
//                   <AccordionTrigger className="bg-crimson  px-4">
//                     <span className="text-white text-sm">
//                       Batches & BDs
//                       <span className="text-xs ml-3">
//                         ({batches.length} batch)
//                       </span>
//                     </span>
//                   </AccordionTrigger>
//                 </AccordionDownloadItem>
//               </>
//             )}

//             {releaserKeys.map((releaser, index) => (
//               <div key={releaser + index}>
//                 {releasersEpisodes &&
//                   releasersEpisodes[releaser] &&
//                   releasersEpisodes[releaser].length > 0 && (
//                     <AccordionDownloadItem
//                       items={releasersEpisodes[releaser]}
//                       valueKey={index + 1}
//                     >
//                       <AccordionTrigger className="p-[11px] px-3 bg-secondary">
//                         <span className="text-sm">
//                           {releaser}

//                           <span className="text-xs ml-3">
//                             ({releasersEpisodes[releaser].length} ep)
//                           </span>
//                         </span>
//                       </AccordionTrigger>
//                     </AccordionDownloadItem>
//                   )}
//               </div>
//             ))}
//           </Accordion>
//         </>
//       )}
//     </>
//   );
// };

// export default EpisodesList;
