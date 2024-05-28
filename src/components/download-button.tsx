import React from "react";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
type DownloadButtonProps = {
  href?: string;
  className?: string;
};
const DownloadButton = ({ href, className }: DownloadButtonProps) => {
  return (
    <Button
      className={`bg-green-700 hover:bg-green-600 ${className} flex items-center gap-2`}
      variant={"destructive"}
    >
      <p>Download</p>
      <Download className=" text-white" size={16} />
    </Button>
  );
};

export default DownloadButton;
