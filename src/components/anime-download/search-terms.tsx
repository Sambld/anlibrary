"use client";

import React from "react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  addAnimeSearchTerm,
  removeAnimeSearchTerm,
} from "@/lib/library/actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { SearchTermType } from "@/db/schema";

type SearchTermsProps = {
  animeId: number;
  searchTerms: SearchTermType[];
};

function SearchTerms({ searchTerms, animeId }: SearchTermsProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTermsList, setSearchTermsList] =
    useState<SearchTermType[]>(searchTerms);

  const addSearchTermHandler = async () => {
    const alreadyExists = searchTermsList.some(
      (term) => term.name === searchTerm
    );

    if (alreadyExists && searchTerm === "" && searchTerm.length < 3) {
      setSearchTerm("");
      return;
    }

    // add Search name
    const response = await addAnimeSearchTerm({
      animeId: animeId,
      animeSearchTerms: searchTerm,
    });

    setSearchTermsList(response);
    setSearchTerm("");
  };

  const removeSearchTermHandler = async (searchTermId: number) => {
    const response = await removeAnimeSearchTerm({
      animeId: animeId,
      searchTermId: searchTermId,
    });

    setSearchTermsList(response);
  };
  return (
    <div className="mt-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="justify-start gap-1">
            Search names{" "}
            {searchTermsList.length > 0 && `(${searchTermsList.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex-col gap-3 ">
              <div className="flex flex-wrap gap-4 items-center h-10">
                <Input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addSearchTermHandler();
                  }}
                  placeholder="Add Search name"
                  className="max-w-72"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
                <Button onClick={addSearchTermHandler} className="p-4 ">
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex gap-6 mt-4">
                {searchTermsList.map((term) => (
                  <div key={term.id} className="flex gap-2 items-center">
                    <span className="text-sm text-gray-500">{term.name}</span>
                    <Button
                      onClick={() => removeSearchTermHandler(term.id)}
                      className="p-2 h-5 bg-red-600 hover:bg-red-500 text-lg text-white"
                    >
                      -
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default SearchTerms;
