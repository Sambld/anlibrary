import { MenuType } from "@/lib/menu-list";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

function MenuItem({ href, label, active, Icon }: MenuType) {
  return (
    <Link href={href}>
      <Button
        variant={active ? "secondary" : "ghost"}
        className="sm:w-full justify-start h-10 my-1"
      >
        <div className="flex gap-4">
          <Icon size={18} />
          <p className="max-md:hidden">{label}</p>
        </div>
      </Button>
    </Link>
  );
}

export default MenuItem;
