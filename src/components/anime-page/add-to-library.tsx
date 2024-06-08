"use client";
import { Library } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { toggleAnime } from "@/lib/library/actions";
import { useToast } from "../ui/use-toast";
import clsx from "clsx";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
type AddAnimeProps = {
  animeId: number;
  isInLibrary: boolean;
};
const AddAnime = ({ animeId, isInLibrary }: AddAnimeProps) => {
  const [isPending, startTransition] = React.useTransition();
  const [inLibrary, setInLibrary] = React.useState(isInLibrary);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [subtitlesLink, setSubtitlesLink] = React.useState("");

  const { toast } = useToast();
  const handleSubmit = async () => {
    startTransition(async () => {
      const response = await toggleAnime({
        animeId,
        subtitlesLink,
      });
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          duration: 1000,
        });
      } else if (response.isInLibrary !== undefined) {
        setInLibrary(response.isInLibrary);
        toast({
          description: response.message,
          duration: 1000,
        });
      } else {
        setDialogOpen(false);
      }
    });
  };
  return (
    <>
      {inLibrary && (
        <Button
          onClick={handleSubmit}
          className={` dark:text-white bg-red-600 hover:bg-red-500`}
          disabled={isPending}
        >
          <Library size={24} className="mr-2" />
          Remove from Library
        </Button>
      )}
      {!inLibrary && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className={` dark:text-white bg-blue-600 hover:bg-blue-500`}
              disabled={isPending}
            >
              <Library size={24} className="mr-2" />
              {!inLibrary && "Add to Library"}
              {inLibrary && "Remove from Library"}
            </Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Configuration</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                <label htmlFor="subtitles_link" className="text-xs w-24">
                  Subtitles Link
                </label>
                <Input
                  id="subtitles_link"
                  type="text"
                  onChange={(e) => setSubtitlesLink(e.target.value)}
                />
              </div>
              <div className="flex gap-4"></div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSubmit} className="w-fit">
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default AddAnime;
