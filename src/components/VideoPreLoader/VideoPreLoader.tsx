import { useEffect } from "react";

const VideoPreloader = ({ src }: any) => {
  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    video.preload = "auto";

    return () => {
      video.src = "";
    };
  }, [src]);

  return null;
};

export default VideoPreloader;
