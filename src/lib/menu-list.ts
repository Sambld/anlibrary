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
      active: pathname === "/",
      Icon: Home,
    },
    {
      href: "/today",
      label: "Today releases",
      active: pathname === "/today",
      Icon: AlarmClock,
    },
    {
      href: "/library",
      label: "Library",
      active: pathname === "/library",
      Icon: Library,
    },
  ];
};
