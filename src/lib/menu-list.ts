import { Home, Library, AlarmClock } from "lucide-react";

export type MenuType = {
  href: string;
  label: string;
  active: boolean;
  Icon: typeof Home;
};

export const getMenuList = (pathname: string): MenuType[] => {
  return [
    {
      href: "/",
      label: "Home",
      active: pathname.includes("/"),
      Icon: Home,
    },
    {
      href: "/today",
      label: "Today releases",
      active: pathname.includes("/today"),
      Icon: AlarmClock,
    },
    {
      href: "/library",
      label: "Library",
      active: pathname.includes("/library"),
      Icon: Library,
    },
  ];
};
