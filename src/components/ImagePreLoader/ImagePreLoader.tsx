import { useEffect } from "react";

const ImagePreLoader = ({ src, alt, ...rest }: any) => {
  useEffect(() => {
    const image = document.createElement("img");
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
