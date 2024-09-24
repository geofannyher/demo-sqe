import MicIcon from "@mui/icons-material/Mic";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import StopIcon from "@mui/icons-material/Stop";
import { useEffect, useRef, useState } from "react";
import AlertSnackbar from "../components/AlertSnackbar/Alertsnackbar";
import TypewriterEffect from "../components/TypewriterEffect/TypewriterEffect";
import VideoRecorder from "../components/VideoRecorder/VideoRecorder";
import {
  chatbot,
  resetChatbot,
  speechToText,
  textToSpeech,
} from "../services/ApiService";

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
          () => chatbot("1", resultText, starName, model),
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

  const handleReset = async () => {
    setIsRecording(false);
    setResults([]);
    makeApiCall(
      () => resetChatbot("1", starName),
      "Error during chatbot reset"
    );
    setOpenSnackbar(!openSnackbar);
    setSnackbarMessage("success reset");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSnackbarMessage("");
  };

  return (
    <div className="flex justify-center items-center h-[100dvh]">
      <div className="flex container max-w-5xl relative">
        <div className="relative">
          <VideoRecorder
            isRecording={isRecording}
            videoSrc={
              showVideo
                ? "https://res.cloudinary.com/dcd1jeldi/video/upload/v1727185191/j6sbsrcht5dodxgjxpoc.mp4"
                : "https://res.cloudinary.com/dcd1jeldi/video/upload/v1726727897/rangga_idle.mp4"
            }
          />
          <div>
            <button
              onClick={() => toggleRecording()}
              onContextMenu={(e) => e.preventDefault()}
              className="absolute left-1/2 transform -translate-x-1/2 bottom-28 text-white font-bold p-2 rounded-full select-none"
              style={{
                zIndex: 100,
                touchAction: "manipulation",
                WebkitTapHighlightColor: "transparent",
                outline: "none",
                width: "60px",
                height: "60px",
                backgroundColor: buttonColor,
              }}
            >
              <span style={{ pointerEvents: "none" }}>{buttonIcon}</span>
            </button>
            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-20 text-white font-bold rounded-full select-none">
              {buttonText}
            </span>
          </div>
        </div>

        {/* User and Star Text Container */}
        <div className="relative h-[900px] w-full overflow-scroll rounded-br-lg rounded-tr-lg bg-black text-white z-20 flex flex-col justify-center items-center overflow-y-auto">
          <button
            onClick={() => handleReset()}
            className="flex shadow-sm items-center bg-violet-500 rounded-full font-semibold justify-center text-white fixed left-[63%] transform -translate-x-1/2 z-50 bottom-28 px-4 py-2"
          >
            click to reset
          </button>
          <div className="w-full h-full p-5 space-y-3">
            {results.map((result: any, _: any) => (
              <div className={`w-full px-4 text-left`}>
                <p
                  className={
                    result.status === "user" ? "user-text" : "star-text"
                  }
                >
                  {result.title.charAt(0).toUpperCase() + result.title.slice(1)}
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
