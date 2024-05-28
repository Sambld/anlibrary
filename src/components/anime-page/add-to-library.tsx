"use client";
import { Library } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { toggleAnime } from "@/lib/actions/library";
import { useToast } from "../ui/use-toast";
type AddAnimeProps = {
  animeId: number;
  isInLibrary: boolean;
};
const AddAnime = ({ animeId, isInLibrary = false }: AddAnimeProps) => {
  const { toast } = useToast();
  const handleSubmit = async () => {
    const response = await toggleAnime(animeId);
    if (response.error) {
      toast({
        title: "Error",
        description: response.error,
        duration: 5000,
      });
    } else {
      console.log(response.message);
      toast({
        title: "Success",
        description: response.message,
        duration: 5000,
      });
    }
  };
  return (
    <Button onClick={handleSubmit}>
      <Library size={24} className="mr-2" />
      {!isInLibrary && "Add to Library"}
      {isInLibrary && "Remove from Library"}
    </Button>
  );
};

export default AddAnime;
