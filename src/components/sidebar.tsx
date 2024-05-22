"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { getMenuList } from "@/lib/menu-list";
import MenuItem from "./menu-item";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";

function SideBar() {
  const path = usePathname();
  const menuList = getMenuList(path);
  return (
    <>
      <nav className="h-screen sticky left-0 top-0 w-60 max-md:w-auto max-md:p-2 max-md:pt-6 border p-6 flex flex-col gap-5 max-sm:hidden">
        <Image
          src={"/assets/logo.png"}
          width={100}
          alt="logo"
          height={100}
          className="max-md:hidden self-center"
        />
        {menuList.map(({ href, label, active, Icon }) => (
          <MenuItem
            key={label}
            href={href}
            label={label}
            active={active}
            Icon={Icon}
          />
        ))}
        <div className="flex flex-col justify-end h-full items-start">
          <ModeToggle />
        </div>
      </nav>

      <nav className="w-full fixed left-0 bottom-0 justify-evenly bg-white dark:bg-black border p-2 flex gap-5 z-10 sm:hidden">
        <Image
          src={"/assets/logo.png"}
          width={100}
          alt="logo"
          height={100}
          className="max-md:hidden self-center"
        />
        {menuList.map(({ href, label, active, Icon }) => (
          <MenuItem
            key={label}
            href={href}
            label={label}
            active={active}
            Icon={Icon}
          />
        ))}
        <div className="flex flex-col justify-end h-full items-start">
          <ModeToggle />
        </div>
      </nav>
    </>
  );
}

export default SideBar;
