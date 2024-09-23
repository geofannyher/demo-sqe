const VideoRecorder = ({ videoSrc }: any) => {
  return (
    <>
      <video
        src={videoSrc}
        controls={false}
        className="rounded-lg max-w-lg mx-auto height-large width-large"
        style={{
          border: "3px solid #293060",
          width: "600px",
          height: "600px",
          objectFit: "cover",
        }}
        autoPlay={true}
        loop={true}
        muted={true}
      />
    </>
  );
};

export default VideoRecorder;
