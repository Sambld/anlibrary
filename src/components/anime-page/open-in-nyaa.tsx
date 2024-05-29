"use client";

import { Skull } from "lucide-react";
import { title } from "process";
import React from "react";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../ui/hover-card";
import { Separator } from "../ui/separator";
type OpenInNyaaProps = {
  title: string;
  title_english: string;
  title_synonyms: string[];
};

const OpenInNyaa = ({
  title,
  title_english,
  title_synonyms,
}: OpenInNyaaProps) => {
  return (
    <HoverCard openDelay={100}>
      <HoverCardTrigger>
        <Button className="bg-violet-600 hover:bg-violet-500 text-white">
          <Skull size={24} className="mr-2" />
          Open in Nyaa
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-56">
        <div className="w-full flex flex-col gap-1">
          <a
            className="text-sm"
            href={`https://nyaa.si/?f=0&c=0_0&q=${title}`}
            target="_blank"
          >
            Default Title
          </a>
          <Separator />
          <a
            className="text-sm"
            href={`https://nyaa.si/?f=0&c=0_0&q=${title_english}`}
            target="_blank"
          >
            English Title
          </a>
          {title_synonyms.map((synonym, index) => (
            <div key={synonym}>
              <Separator />

              <a
                className="text-sm"
                key={synonym}
                href={`https://nyaa.si/?f=0&c=0_0&q=${synonym}`}
                target="_blank"
              >
                <span className="text-xs underline">Sysnonym #{index + 1}</span>{" "}
                : {synonym}
              </a>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default OpenInNyaa;
