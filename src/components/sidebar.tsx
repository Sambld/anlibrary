"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { getMenuList } from "@/lib/menu-list";
import MenuItem from "./menu-item";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "./ui/dialog";
import AuthPage from "./auth/auth";
import { LogOut, User as UserIcon } from "lucide-react";
import { useSession } from "./providers/session-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { logout } from "@/lib/actions/authentication";

export const SideBar = () => {
  // console.log(user);
  // const user = await getUser();
  const { user } = useSession();
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
        {user && (
          <div className="flex gap-3 justify-center items-center mb-5 max-md:hidden">
            <UserIcon size={20} />
            <span>{user.username}</span>
            <LogOutButton />
          </div>
        )}
        {menuList.map(({ href, label, active, Icon }) => (
          <MenuItem
            key={label}
            href={href}
            label={label}
            active={active}
            Icon={Icon}
          />
        ))}
        <div className="flex flex-col justify-end h-full max-md:items-center">
          <div className="flex gap-2 max-md:flex-col items-center">
            {!user && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <UserIcon size={15} />
                  </Button>
                </DialogTrigger>
                <DialogContent
                  closebutton={"hidden"}
                  className="w-[500px] max-sm:w-[90%] min-h-[300px] p-4 "
                >
                  <AuthPage />
                </DialogContent>
              </Dialog>
            )}
            <ModeToggle />
            {user && <LogOutButton className="md:hidden" />}
          </div>
        </div>
      </nav>

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

        {!user && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <UserIcon size={15} />
              </Button>
            </DialogTrigger>
            <DialogContent
              closebutton={"hidden"}
              className="w-[500px] max-sm:w-[90%] min-h-[300px] p-4  "
            >
              <AuthPage />
            </DialogContent>
          </Dialog>
        )}

        <ModeToggle />
        {user && <LogOutButton />}
      </nav>
    </>
  );
};

const LogOutButton = ({ className }: { className?: string }) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild className={`${className}`}>
          <Button
            onClick={() => logout()}
            variant="outline"
            size="sm"
            className="self-end border-none"
          >
            <LogOut size={15} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Logout</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SideBar;
