const VideoRecorder = ({ videoSrc }: any) => {
  return (
    <>
      <video
        src={videoSrc}
        controls={false}
        className="rounded-lg border-[#293060] rounded-tr-sm rounded-br-sm height-large width-large max-w-lg mx-auto"
        style={{
          width: "600px",
          height: "600px",
          objectFit: "cover",
          objectPosition: "20% 100%",
        }}
        autoPlay={true}
        loop={true}
        muted={true}
      />
    </>
  );
};

export default VideoRecorder;
