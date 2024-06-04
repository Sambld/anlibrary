"use client";
import { Library } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { toggleAnime } from "@/lib/library/actions";
import { useToast } from "../ui/use-toast";
import clsx from "clsx";
type AddAnimeProps = {
  animeId: number;
  isInLibrary: boolean;
};
const AddAnime = ({ animeId, isInLibrary }: AddAnimeProps) => {
  const [isPending, startTransition] = React.useTransition();
  const [inLibrary, setInLibrary] = React.useState(isInLibrary);

  const { toast } = useToast();
  const handleSubmit = async () => {
    startTransition(async () => {
      const response = await toggleAnime(animeId);
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          duration: 1000,
        });
      } else {
        if (response.isInLibrary !== undefined) {
          setInLibrary(response.isInLibrary);
          toast({
            description: response.message,
            duration: 1000,
          });
        }
      }
    });
  };
  return (
    <Button
      className={clsx(` dark:text-white`, {
        "bg-blue-600 hover:bg-blue-500": !inLibrary,
        "bg-red-600 hover:bg-red-500": inLibrary,
      })}
      disabled={isPending}
      onClick={handleSubmit}
    >
      <Library size={24} className="mr-2" />
      {!inLibrary && "Add to Library"}
      {inLibrary && "Remove from Library"}
    </Button>
  );
};

export default AddAnime;
