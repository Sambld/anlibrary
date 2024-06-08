import {
  getAnimeBatches,
  getAnimeEpisodesByReleasers,
} from "@/lib/nyaa/scrapper";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const json: {
    type: string;
    animeName: {
      default: string;
      english?: string;
    };
    releasers: string[];
  } = await request.json();

  // check if the request is valid
  const { type, animeName, releasers } = json;
  if (!type || !animeName) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (releasers && releasers.length === 0) {
    // default to SubsPlease if no releasers are specified
    releasers.push("[SubsPlease]");
  }
  if (type === "episodes") {
    if (!releasers || !releasers.length) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }
    const episodes = await getAnimeEpisodesByReleasers({
      animeName,
      releasers,
    });
    return Response.json({ episodes });
  }

  if (type === "batches") {
    const batches = await getAnimeBatches({
      animeTitle: animeName,
    });

    // console.log(batches);

    return Response.json({ batches });
  }

  return Response.json({ error: "Invalid request" }, { status: 400 });
}
