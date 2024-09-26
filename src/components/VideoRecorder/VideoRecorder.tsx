const VideoRecorder = ({ videoSrc }: any) => {
  return (
    <>
      <video
        src={videoSrc}
        controls={false}
        className="rounded-lg border-[#293060]  rounded-tr-sm rounded-br-sm w-[500px] h-[500px] max-w-lg mx-auto"
        style={{
          objectFit: "cover",
          objectPosition: "50% 100%",
        }}
        autoPlay={true}
        loop={true}
        muted={true}
      />
    </>
  );
};

export default VideoRecorder;
