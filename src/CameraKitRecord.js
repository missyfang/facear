import { useEffect, useRef, useState } from "react";
import { CameraKit } from "@snap/camera-kit";

const CameraKitRecorder = () => {
  const videoRef = useRef(null);
  const [cameraKit, setCameraKit] = useState(null);
  const [session, setSession] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);

  useEffect(() => {
    const initCameraKit = async () => {
      const cameraKitInstance = await CameraKit.init({
        apiToken: "YOUR_API_TOKEN", // Replace with your Camera Kit API token
      });

      const cameraSession = await cameraKitInstance.createSession();
      setCameraKit(cameraKitInstance);
      setSession(cameraSession);

      if (videoRef.current) {
        cameraSession.attachToElement(videoRef.current);
        await cameraSession.start();
      }
    };

    initCameraKit();
  }, []);

  const startRecording = async () => {
    if (session) {
      setIsRecording(true);
      const recordedData = await session.record({
        mimeType: "video/webm", // Adjust format as needed
      });
      setRecordedBlob(recordedData);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    if (session) {
      await session.stopRecording();
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {recordedBlob && (
        <video controls src={URL.createObjectURL(recordedBlob)} />
      )}
    </div>
  );
};

export default CameraKitRecorder;
