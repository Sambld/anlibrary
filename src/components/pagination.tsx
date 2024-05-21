"use client";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationLinksProps {
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export function PaginationLinks({ pagination }: PaginationLinksProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleNavigation = (page: number) => {
    const params = new URLSearchParams(searchParams as any);
    params.set("page", page.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const { current_page, last_visible_page, has_next_page } = pagination;

  const createPaginationItems = () => {
    const delta = 1;
    const range = [
      1,
      ...Array.from(
        { length: delta * 2 + 1 },
        (_, i) => i + current_page - delta
      ).filter((page) => page > 1 && page < last_visible_page),
      last_visible_page,
    ];

    const items: React.ReactNode[] = [];
    let prevPage: number | null = null;

    for (const page of range) {
      if (prevPage !== null && page - prevPage > 1) {
        items.push(
          <PaginationItem key={`ellipsis-${prevPage}-${page}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation(page);
            }}
            isActive={current_page === page}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );

      prevPage = page;
    }

    return items;
  };

  return (
    <Pagination className="mb-14">
      <PaginationContent>
        <PaginationItem hidden={current_page === 1} className="max-sm:hidden">
          <PaginationPrevious
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              if (current_page > 1) handleNavigation(current_page - 1);
            }}
            isActive={current_page === 1}
          />
        </PaginationItem>
        {createPaginationItems()}
        <PaginationItem hidden={!has_next_page} className="max-sm:hidden">
          <PaginationNext
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              if (has_next_page) handleNavigation(current_page + 1);
            }}
            isActive={!has_next_page}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
