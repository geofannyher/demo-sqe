import { useState, useEffect } from "react";

const VideoRecorder = ({ videoSrc }: any) => {
  const [currentSrc, setCurrentSrc] = useState(videoSrc);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true); // Mulai fade-out ketika video source berubah
    const timeoutId = setTimeout(() => {
      setCurrentSrc(videoSrc); // Ganti video setelah fade-out
      setFade(false); // Mulai fade-in setelah source diganti
    }, 300); // Durasi fade-out

    return () => clearTimeout(timeoutId);
  }, [videoSrc]);

  return (
    <div
      className={`video-container transition-opacity duration-500 ease-in-out ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        src={currentSrc}
        controls={false}
        className="rounded-lg max-w-xl mx-auto height-large width-large"
        style={{
          border: "3px solid #293060",
          width: "600px",
          height: "750px",
          objectFit: "cover",
        }}
        autoPlay={true}
        loop={true}
        muted={true}
      />
    </div>
  );
};

export default VideoRecorder;
