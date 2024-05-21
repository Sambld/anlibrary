"use client";
import { Search } from "lucide-react";
import React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { debounce } from "@/lib/utils";
import { Input } from "../ui/input";
const SearchInput = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const pathname = usePathname();

  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams as any);
    const searchQuery = e.target.value;
    params.set("page", "1");
    if (searchQuery) {
      params.set("q", searchQuery);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="relative h-10 w-full ">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
      <Input
        type="search"
        placeholder="Search for an anime globaly..."
        className="pl-12 pr-4 py-3 text-sm w-full focus-visible:ring-0 rounded   " // Add additional styling as needed
        onChange={handleSearch}
        defaultValue={searchParams.get("q")?.toString()}
      />
    </div>
  );
};

export default SearchInput;
