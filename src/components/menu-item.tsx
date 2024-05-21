import { MenuType } from "@/lib/menu-list";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

function MenuItem({ href, label, active, Icon }: MenuType) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className="sm:w-full justify-start h-10 mb-1"
    >
      <Link href={href}>
        <div className="flex gap-4">
          <Icon size={18} />
          <p className="max-md:hidden">{label}</p>
        </div>
      </Link>
    </Button>
  );
}

export default MenuItem;
