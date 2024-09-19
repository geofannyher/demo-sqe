import { useEffect, useRef, useState } from "react";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AlertSnackbar from "../components/AlertSnackbar/Alertsnackbar";
import VideoRecorder from "../components/VideoRecorder/VideoRecorder";
import { chatbot, speechToText, textToSpeech } from "../services/ApiService";
import logo from "../assets/logo.svg";
import TypewriterEffect from "../components/TypewriterEffect/TypewriterEffect";

const Star = () => {
  const [startTime, setStartTime] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoadingChatResponse, setIsLoadingChatResponse] = useState(false);
  const [newestMessageId, setNewestMessageId] = useState<null | number>(null);
  const [buttonText, setButtonText] = useState(
    "Press the button and start talking"
  );
  const [buttonColor, setButtonColor] = useState("#6C2B85");
  const [buttonIcon, setButtonIcon] = useState(<MicIcon />);
  const [showVideo, setShowVideo] = useState(false);
  const [voiceId] = useState("p4Q7LAvLfBj7ACLNCF2K");
  const [model] = useState("gpt-4o");
  const [starName] = useState("rangga_sqe");
  const [results, setResults] = useState<any>([]);
  const [stream, setStream] = useState<any>(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const mediaRecorder: any = useRef(null);
  const mimeType = "audio/webm";

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setStream(streamData);
      } catch (err: any) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  useEffect(() => {
    getMicrophonePermission();

    if (isLoadingChatResponse) {
      setButtonText("Loading Chat Response...");
    } else {
      setButtonColor("#6C2B85");
      setButtonIcon(<MicIcon />);
      setButtonText("Press the button and start talking");
    }
  }, [results, isLoadingChatResponse]);

  const addMessage = async (text: string, status: string, title: string) => {
    const newMessage = { status, title, result: text, id: Date.now() };
    setResults((prevResults: any) => [newMessage, ...prevResults]);
    setNewestMessageId(newMessage.id);
  };

  const makeApiCall = async (apiFunc: any, errorMessage: string) => {
    try {
      const response = await apiFunc();
      return response;
    } catch (error) {
      console.error(error);
      setSnackbarMessage(errorMessage);
      setOpenSnackbar(true);
      setIsLoadingChatResponse(false);
      setShowVideo(false);
      return null;
    }
  };

  const startRecording = async () => {
    setStartTime(Date.now());
    const media: any = new MediaRecorder(stream, { mimeType: mimeType });
    mediaRecorder.current = media;
    let localAudioChunks: any = [];
    mediaRecorder.current.ondataavailable = (event: any) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    mediaRecorder.current.start();
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = async () => {
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = async () => {
      // clearTimeout(silenceTimeout);
      const endTime = Date.now();
      const duration = endTime - startTime;

      if (duration < 1000) {
        setSnackbarMessage("Please record at least 1 second of audio");
        setOpenSnackbar(true);
        setButtonColor("#6C2B85");
        setButtonIcon(<MicIcon />);
        setButtonText("Press the button and start talking");
        setIsRecording(false);
        return;
      }
      if (audioChunks.length === 0) {
        setIsRecording(false);
        setButtonText("No audio input");
        setTimeout(() => {
          setButtonColor("#6C2B85");
          setButtonIcon(<MicIcon />);
          setButtonText("Press the button and start talking");
        }, 3000);
        return;
      }
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      const reader = new FileReader();

      reader.onload = async () => {
        const base64String = reader.result;
        const speechResponse = await makeApiCall(
          () => speechToText(base64String),
          "Error during speech-to-text processing"
        );

        if (!speechResponse) return;

        const resultText = speechResponse.data;
        await addMessage(resultText, "user", "User");
        setIsLoadingChatResponse(true);

        const chatResponse = await makeApiCall(
          () => chatbot("dev", resultText, starName, model),
          "Error during chatbot processing"
        );

        if (!chatResponse) return;

        const resultChat = chatResponse.data;
        const audioResponse = await makeApiCall(
          () => textToSpeech(resultChat, voiceId),
          "Error during text-to-speech processing"
        );

        if (!audioResponse) return;

        setIsLoadingChatResponse(false);
        setShowVideo(true);

        await addMessage(resultChat, "star", starName);

        const resultAudioChat = audioResponse.data;
        if (resultAudioChat) {
          const audio = new Audio(resultAudioChat);

          audio.onended = () => {
            setShowVideo(false);
          };

          audio.play().catch((e) => console.error("Error playing audio:", e));
        } else {
          setShowVideo(false);
        }

        setShowVideo(true);
      };

      reader.readAsDataURL(audioBlob);
      setAudioChunks([]);
    };
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
      setIsRecording(true);
      setButtonIcon(<StopIcon />);
      setButtonText("Recording...");
    } else {
      stopRecording();
      setIsRecording(false);
      setButtonColor("#999999");
      setButtonIcon(<MoreHorizIcon />);
      setButtonText("Processing...");
    }
  };

  // const handleReset = async () => {
  //   setIsRecording(false);
  //   setResults([]);
  //   makeApiCall(() => resetChatbot("1", "ibu"), "Error during chatbot reset");
  // };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen  mt-5">
      <div className="relative h-screen flex justify-center items-center">
        <div className="absolute h-screen mt-5 flex flex-col items-center">
          <img
            src={logo}
            alt="logo"
            className="mb-8 "
            style={{ width: "1000px" }}
            onClick={() => {
              window.location.href = "/choose-star";
            }}
          />
          <div className=" relative">
            {/* <button
              onClick={handleReset}
              className="top-0 absolute right-0 bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded-full focus:outline-none focus:shadow-outline"
              style={{ top: "100px", zIndex: 10 }}
            >
              <RestartAltIcon />
            </button> */}

            <div className="relative">
              <VideoRecorder
                isRecording={isRecording}
                videoSrc={
                  showVideo
                    ? "https://res.cloudinary.com/dcd1jeldi/video/upload/v1726727975/x6sip8w4edmg3exxu9zj.mp4"
                    : "https://res.cloudinary.com/dcd1jeldi/video/upload/v1726727897/rangga_idle.mp4"
                }
              />
              {/* User and Star Text Container */}
              {results && results.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-black bg-opacity-50 text-white z-20 flex flex-col justify-center items-center overflow-y-auto">
                  <div className="w-full h-full px-4 space-y-3">
                    {results.map((result: any, _: any) => (
                      <div
                        className={`w-full px-4 ${
                          result.status === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        <p
                          className={
                            result.status === "user" ? "user-text" : "star-text"
                          }
                        >
                          {result.title.charAt(0).toUpperCase() +
                            result.title.slice(1)}
                        </p>
                        <div className="content-text">
                          {result.id === newestMessageId ? (
                            <TypewriterEffect text={result.result} />
                          ) : (
                            <span className="text-white">{result.result}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => toggleRecording()}
              onContextMenu={(e) => e.preventDefault()}
              className="relative left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold p-2 rounded-full my-4 select-none overflow-y-auto"
              style={{
                top: "-20px",
                zIndex: 30,
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                outline: "none",
                width: "50px",
                height: "50px",
                backgroundColor: buttonColor,
              }}
            >
              <span style={{ pointerEvents: "none" }}>{buttonIcon}</span>
            </button>
          </div>
          <p className="text-center text-[#293060] font-bold">{buttonText}</p>
        </div>
      </div>
      <AlertSnackbar
        open={openSnackbar}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Star;
