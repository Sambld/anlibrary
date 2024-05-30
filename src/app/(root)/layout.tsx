import SideBar from "@/components/sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex relative min-h-screen">
      <SideBar />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default layout;
