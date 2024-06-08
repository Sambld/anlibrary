"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { getMenuList } from "@/lib/menu-list";
import MenuItem from "./menu-item";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";

export const SideBar = () => {
  const path = usePathname();
  const menuList = getMenuList(path);
  return (
    <>
      <nav className="h-screen sticky left-0 top-0 w-60 max-md:w-auto max-md:p-2 max-md:pt-6  border p-6 flex flex-col gap-5 max-sm:hidden">
        <Image
          src={"/assets/logo.png"}
          width={100}
          alt="logo"
          height={100}
          className="max-md:hidden self-center"
        />

        {/* <div className="max-sm:mt-10"> */}
        {menuList.map(({ href, label, active, Icon }) => (
          <MenuItem
            key={label}
            href={href}
            label={label}
            active={active}
            Icon={Icon}
          />
        ))}
        {/* </div> */}
        <div className="flex flex-col justify-end h-full max-md:items-center">
          <div className="flex gap-2 flex-col max-md:flex-col-reverse">
            <ModeToggle />
          </div>
        </div>
      </nav>

      {/* navigation bar for small screens */}
      <nav className="w-full fixed left-0 bottom-0 justify-evenly bg-white items-center dark:bg-black border p-2 flex gap-5 z-10 sm:hidden">
        {menuList.map(({ href, label, active, Icon }) => (
          <MenuItem
            key={label}
            href={href}
            label={label}
            active={active}
            Icon={Icon}
          />
        ))}

        <ModeToggle />
      </nav>
    </>
  );
};

export default SideBar;
