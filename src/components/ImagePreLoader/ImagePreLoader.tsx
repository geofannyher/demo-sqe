import { useEffect } from "react";

const ImagePreLoader = ({ src, alt }: any) => {
  useEffect(() => {
    const image: any = document.createElement("img");
    image.src = src;
    image.alt = alt;
    image.preload = "auto";

    return () => {
      image.src = "";
    };
  }, [src, alt]);

  return null;
};

export default ImagePreLoader;
