import SideBar from "@/components/sidebar";
import React from "react";
import BackgroundImage from "@/../public/assets/background.jpg";
import Image from "next/image";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex relative min-h-screen">
      <Image
        style={{
          zIndex: -100,
          opacity: "6%",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw",
          objectFit: "cover",
        }}
        src={BackgroundImage}
        alt="background image"
      />
      <SideBar user={null} />

      <div className="flex-1">{children}</div>
    </div>
  );
};

export default layout;
