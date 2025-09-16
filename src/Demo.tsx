import "./Demo.css";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useEffect } from "react";
import { useState } from "react";
import { renderAR } from "./renderAR";
import { bootstrapCameraKit, createMediaStreamSource } from "@snap/camera-kit";
import { useRef } from "react";
import { demoExercises } from "./ExerciseList";
import { LensConfig } from "./constant/lensConfig";

type DemoProps = {
  config: LensConfig;
};

function Demo({ config }: DemoProps) {
  const { lensID, name, description, features, availableExercises } = config;
  
  type LensData = {
    completedReps?: number;
  };

  const [lensData, setLensData] = useState<LensData | null>(null);
  const [difficulty, setDifficulty] = useState("0.5");
  const [minDifficulty, setMinDifficulty] = useState(0.5);
  const [isStarted, setIsStarted] = useState(false);
  const [isLeftOn, setIsLeftOn] = useState(true);
  const [isRightOn, setIsRightOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ left: "50%" });
  const [exerciseType, setExerciseType] = useState("timer"); // Default exercise type
  const [exerciseDuration, setExerciseDuration] = useState("10"); // Default timer value in seconds
  const [reps, setReps] = useState("5"); // Default number of reps
  const [sets, setSets] = useState("3"); // Default number of sets
  const [selectedExercise, setSelectedExercise] = useState(
    availableExercises?.[0] || ""
  );
  const [recordingTime, setRecordingTime] = useState(0);
  const [showRedCircle, setShowRedCircle] = useState(false);
  const [gameSpeed, setGameSpeed] = useState("0.5");
  const [speedtipPosition, setSpeedTipPosition] = useState({ left: "50%" });
  const liveRenderTarget = document.getElementById(
    "canvas"
  ) as HTMLCanvasElement;

  const videoContainer = document.getElementById(
    "video-container"
  ) as HTMLElement;

  const videoTarget = document.getElementById("video") as HTMLVideoElement;

  const startRecordingButton = document.getElementById(
    "start"
  ) as HTMLButtonElement;

  const stopRecordingButton = document.getElementById(
    "stop"
  ) as HTMLButtonElement;

  const downloadButton = document.getElementById(
    "download"
  ) as HTMLButtonElement;

  let downloadUrl: string;

  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoTargetRef = useRef<HTMLVideoElement | null>(null);
  const startRecordingButtonRef = useRef<HTMLButtonElement | null>(null);
  const stopRecordingButtonRef = useRef<HTMLButtonElement | null>(null);
  const downloadButtonRef = useRef<HTMLButtonElement | null>(null);
  let mediaRecorder: MediaRecorder;

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const dataHandlers = {
      setDifficulty: (value: string) => {
        setDifficulty(Math.max(0, parseFloat(value) + 0.05).toString());
        setMinDifficulty(Math.max(0, parseFloat(value) + 0.05));

        const sliderWidth = 200;
        const thumbPosition = (+value - minDifficulty) * sliderWidth / (1 - minDifficulty);
        setTooltipPosition({ left: `${thumbPosition}px` });
      }
    };

    renderAR(setLensData, lensID, dataHandlers).then((fn) => {
      cleanup = fn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [lensID]);

  useEffect(() => {
    // Add a small delay to ensure the buttons are rendered
    const timer = setTimeout(() => {
      if (
        startRecordingButtonRef.current &&
        stopRecordingButtonRef.current &&
        downloadButtonRef.current
      ) {
        bindRecorder();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isStarted]); // Add isStarted as dependency so it rebinds when buttons become visible

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    setDifficulty(input.value);
    // Update tooltip position based on slider's thumb
    const sliderWidth = input.offsetWidth;
    const thumbPosition = (+input.value - 0.5) * sliderWidth;
    setTooltipPosition({ left: `${thumbPosition}px` });
  };

  const handleToggleSide = (side: "left" | "right") => {
    if (side === "left") {
      if (isLeftOn) {
        setIsRightOn(true); // Ensure Right stays on when Left is turned off
      }
      setIsLeftOn(!isLeftOn);
    } else if (side === "right") {
      if (isRightOn) {
        setIsLeftOn(true); // Ensure Left stays on when Right is turned off
      }
      setIsRightOn(!isRightOn);
    }
  };

  const handlePrevious = () => {
    //TODO
  };

  const handleNext = () => {
    //TODO
  };

  const handleExerciseSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedExercise(event.target.value);
  };

  const getCurrentExerciseName = () => {
    if (selectedExercise) {
      return selectedExercise;
    }
    return "Sample Exercise";
  };


  const handleUpdate = () => {
    console.log("Settings updated:", {
      difficulty,
      exerciseType,
      exerciseDuration,
      reps,
      sets,
      isLeftOn,
      isRightOn,
    });
  };

  async function init() {
    const cameraKit = await bootstrapCameraKit({
      apiToken:
        "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzE1NjQwNjk0LCJzdWIiOiI5YmFmZmI5Ni01ZDNlLTQ2MzUtYmIwNC00ZGFhYzNiZmQ0YTh-U1RBR0lOR345ZjJkN2Q5Ni00OTdkLTQ1YjYtODcxYy1mZDg4MzcxYjRmNTYifQ.k-Rl8uGTuACnIfjZrjMi4OSC26OStxBF6wjipB_hDYI",
    });

    const session = await cameraKit.createSession({ liveRenderTarget });

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    const source = createMediaStreamSource(mediaStream);

    await session.setSource(source);
    await session.play();

    const { lenses } = await cameraKit.lensRepository.loadLensGroups([
      "1002ed8b-a97a-42f0-842f-21b57f4a8a42",
    ]);

    session.applyLens(lenses[0]);
  }

  function bindRecorder() {
    if (
      !startRecordingButtonRef.current ||
      !stopRecordingButtonRef.current ||
      !downloadButtonRef.current ||
      !videoContainerRef.current ||
      !videoTargetRef.current
    ) {
      console.error("One or more elements are missing");
      return;
    }

    startRecordingButtonRef.current.addEventListener("click", () => {
      startRecordingButtonRef.current!.disabled = true;
      stopRecordingButtonRef.current!.disabled = false;
      downloadButtonRef.current!.disabled = true;
      videoContainerRef.current!.style.display = "none";
      setIsRecording(true);

      const mediaStream = document.querySelector("canvas")!.captureStream(30);
      mediaRecorder = new MediaRecorder(mediaStream);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (!event.data.size) {
          console.warn("No recorded data available");
          return;
        }

        const blob = new Blob([event.data]);
        downloadUrl = window.URL.createObjectURL(blob);
        downloadButtonRef.current!.disabled = false;

        videoTargetRef.current!.src = downloadUrl;
        videoContainerRef.current!.style.display = "block";
      });

      mediaRecorder.start();
    });

    stopRecordingButtonRef.current.addEventListener("click", () => {
      startRecordingButtonRef.current!.disabled = false;
      stopRecordingButtonRef.current!.disabled = true;
      setIsRecording(false);
      mediaRecorder?.stop();
    });

    downloadButtonRef.current.addEventListener("click", () => {
      const link = document.createElement("a");
      link.setAttribute("style", "display: none");
      link.href = downloadUrl;
      link.download = "camera-kit-web-recording.webm";
      link.click();
      link.remove();
    });
  }

  const handleImportLensData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const rows = content.split("\n").map((row) => row.split(","));
      if (rows.length < 2) return;

      const headers = rows[0].map((h) => h.trim());
      const values = rows[1].map((v) => v.trim());
      const data: Record<string, string> = {};
      headers.forEach((header, idx) => {
        data[header] = values[idx];
      });

      // Update state based on imported data
      if (data["Difficulty Level"]) setDifficulty(data["Difficulty Level"]);
      if (data["Exercise Duration (seconds)"]) setExerciseDuration(data["Exercise Duration (seconds)"]);
      if (data["Required Reps"]) setReps(data["Required Reps"]);
      if (data["Required Sets"]) setSets(data["Required Sets"]);
      if (data["Enabled Left Side"])
        setIsLeftOn(data["Enabled Left Side"] === "Enabled");
      if (data["Enabled Right Side"])
        setIsRightOn(data["Enabled Right Side"] === "Enabled");
      if (data["Exercise Type"]) setExerciseType(data["Exercise Type"]);
      // Add more fields as needed

      alert("Settings updated from imported lensData!");
    };
    reader.readAsText(file);
  };

  const handleOutputLog = () => {
    if (!lensData) {
      alert("No data to download yet!");
      return;
    }

    // Create CSV header (all keys of lensData) and row (all values)
    const headers = [
      ...Object.keys(lensData),
      "Exercise Name",
      "Exercise Type",
      "Difficulty Level",
      "Exercise Duration (seconds)",
      "Required Reps",
      "Required Sets",
      "Enabled Left Side",
      "Enabled Right Side",
    ];
    const lensValues = Object.keys(lensData).map(
      (key) => (lensData as any)[key]
    );
    const exerciseValues = demoExercises.map((exercise) => [
      exercise.Name,
      exercise.ExerciseType,
      difficulty, // Difficulty level
      exerciseType === "timer" ? exerciseDuration : "N/A", // Duration for timer type
      exerciseType === "repetitive" ? reps : "N/A", // Reps for repetitive type
      exerciseType === "repetitive" ? sets : "N/A", // Sets for repetitive type
      isLeftOn ? "Enabled" : "Disabled", // Left side status
      isRightOn ? "Enabled" : "Disabled", // Right side status
    ]);

    // Combine lensData and exercise data into CSV rows
    const csvRows = exerciseValues.map((exerciseRow) =>
      [...lensValues, ...exerciseRow].join(",")
    );

    const csvContent = `${headers.join(",")}\n${csvRows.join("\n")}`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    // Generate timestamp like 2025-04-28_14-30-00
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .replace(/\..+/, "");

    const filename = `lensData_${timestamp}.csv`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
        // Toggle red circle every 500ms for blinking effect
        setShowRedCircle((prev) => !prev);
      }, 500);
    } else {
      setRecordingTime(0);
      setShowRedCircle(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 120); // Divide by 120 since we increment every 0.5s
    const secs = Math.floor((seconds % 120) / 2);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Container className="px-4">
      {/* <div className="top-right-text">
        {lensData?.completedReps ?? "Loading..."}
      </div> */}

      {!isStarted ? (
        // Before clicking the start button, show the exercise description
        <Row>
          <Col md={3} className="exercise-panel">
            <h2 className="fs-3">
              <b>{name}</b>
            </h2>
            <hr className="separator" />
            <p className="exercise-description">
              {description}
            </p>
          </Col>
          <Col md={8} className="text-center">
            <div style={{ position: "relative" }}>
              <h1 className="demo-title">
                <b>
                  <span className="gradient-text">Demo</span>
                </b>
              </h1>
            </div>
            <div
              className="bg-gray"
              // style={{marginRight:"-120px"}}
              id="canvas-container"
            ></div>
            <Button
              id="startButton"
              variant="primary"
              onClick={handleStart}
              disabled={isStarted}
              className="start-button w-50 mt-3"
              style={{
                backgroundColor: "#0284c7",
                borderColor: "#2563eb",
                color: "white",
              }}
            >
              Start
            </Button>
          </Col>
        </Row>
      ) : (
        //After clicking the Start button, show the setting panel and change the button to "next" and "previous"
        <Row>
          <Col md={3} className="settings-panel">
            <h2 className="fs-3">
              <b>Settings</b>
            </h2>
            <p className="setting-description">
              In this setting panel, you will be able to adjust the difficulty
              level through the slider below and toggle the bilateral setting
              buttons
            </p>

            <hr className="separator" />

            {/* Exercise Selection Dropdown - Add this FIRST in the settings */}
            {features.showExerciseSelection && 
             availableExercises && 
             availableExercises.length > 0 && (
              <div>
                <Form.Group controlId="exerciseSelection" className="mb-3">
                  <Form.Label>
                    <b>Select {features.exerciseTypes.includes("game") ? "Game" : "Exercise"}</b>
                  </Form.Label>
                  <Form.Select
                    value={selectedExercise}
                    onChange={handleExerciseSelectionChange}
                  >
                    {availableExercises.map(exercise => (
                      <option key={exercise} value={exercise}>
                        {exercise}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Choose the specific {features.exerciseTypes.includes("game") ? "game" : "exercise"} you want to perform
                  </Form.Text>
                </Form.Group>
                <hr className="separator" />
              </div>
            )}

            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-top">
                  <div
                    style={{
                      position: "absolute",
                      top: "-30px",
                      left: tooltipPosition.left,
                      color: "#000",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    {difficulty}
                  </div>
                </Tooltip>
              }
            >
              <Form.Range
                id="myDifficulty"
                min={minDifficulty}
                max={1}
                step={0.1}
                value={difficulty}
                onChange={handleSliderChange}
              />
            </OverlayTrigger>
            <Form.Label className="difficulty-label">
              Difficulty
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip-top">
                    Adjusts the difficulty value of the AR lens detection.
                  </Tooltip>
                }
              >
                <span className="difficulty-infoIcon">
                  &#9432; {/* Unicode for a small 'info' symbol */}
                </span>
              </OverlayTrigger>
            </Form.Label>

            <hr className="separator" />
            {features.exerciseTypes.includes("timer") && features.showDuration && (
              <div>
                <Form.Group controlId="exerciseDuration" className="mb-3">
                  <Form.Label>
                    <b>Exercise Duration (seconds)</b>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min={10}
                    value={exerciseDuration}
                    onChange={(e) => setExerciseDuration(e.target.value)}
                  />
                  <Form.Text>{exerciseDuration} seconds</Form.Text>
                </Form.Group>
                <hr className="separator" />
              </div>
            )}

            {features.exerciseTypes.includes("repetitive") && features.showRepsAndSets && (
              <div>
                <Form.Group controlId="exerciseReps" className="mb-3">
                  <Form.Label>
                    <b>Number of Repetitions</b>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    id="numReps"
                    min={1}
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="exerciseSets" className="mb-3">
                  <Form.Label>
                    <b>Number of Sets</b>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    id="numSets"
                    min={1}
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                  />
                </Form.Group>
                <hr className="separator" />
              </div>
            )}

            {/* Speed Slider - only show for jump game */}
            {features.showSpeedSlider && (
              <div>
                <Form.Label className="speed-label">
                  Game Speed
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="speed-tooltip">
                        Adjusts the speed of the jump game (0.1 = slow, 1.0 = fast)
                      </Tooltip>
                    }
                  >
                    <span className="speed-infoIcon">&#9432;</span>
                  </OverlayTrigger>
                </Form.Label>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="speed-tooltip-top">
                      <div
                        style={{
                          position: "absolute",
                          top: "-30px",
                          left: speedtipPosition.left,
                          color: "#000",
                          padding: "5px",
                          borderRadius: "5px",
                        }}
                      >
                        {gameSpeed}
                      </div>
                    </Tooltip>
                  }
                >
                  <Form.Range
                    id="myGameSpeed"
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    value={gameSpeed}
                    onChange={(e) => {
                      setGameSpeed(e.target.value);
                    }}
                  />
                </OverlayTrigger>
                <div className="d-flex justify-content-between">
                  <small className="text-muted">Slow</small>
                  <small className="text-muted">Fast</small>
                </div>
                <hr className="separator" />
              </div>
            )}

            {features.showBilateralToggles && (
              <div>
                <Row className="mb-3">
                  <Col xs={6}>
                    <Form.Check
                      type="switch"
                      id="leftSwitch"
                      checked={isLeftOn}
                      onChange={() => handleToggleSide("left")}
                      className="custom-switch mt-3"
                    />
                    <div className="switch-label">Left</div>
                  </Col>

                  <Col xs={6}>
                    <Form.Check
                      type="switch"
                      id="rightSwitch"
                      checked={isRightOn}
                      onChange={() => handleToggleSide("right")}
                      className="custom-switch mt-3"
                    />
                    <div className="switch-label">
                      Right
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-top">
                            Adjusts the bilateral setting of the lens
                          </Tooltip>
                        }
                      >
                        <span className="switch-infoIcon">&#9432;</span>
                      </OverlayTrigger>
                    </div>
                  </Col>
                </Row>
                <hr className="separator" />
              </div>
            )}
          </Col>

          <Col md={8} className="text-center">
            <div style={{ position: "relative" }}>
              <h1 className="demo-title">
                <b>
                  <span className="gradient-text">Demo</span>
                </b>
              </h1>
            </div>
            <div
              className="bg-gray"
              // style={{marginRight:"-120px"}}
              id="canvas-container"
            >
              {/* Recording Timer Overlay */}
              {isRecording && (
                <div className="recording-indicator">
                  <div
                    className={`recording-dot ${showRedCircle ? "active" : ""}`}
                  ></div>
                  <span>REC {formatTime(recordingTime)}</span>
                </div>
              )}
            </div>

            <div
              style={{ width: "100%", margin: "0 auto", position: "relative" }}
            >
              <div
                className="d-flex justify-content-center align-items-center mt-3"
                style={{ gap: "20px" }}
              >
                <Button
                  id="prevButton"
                  variant="secondary"
                  onClick={handlePrevious}
                  style={{
                    backgroundColor: "#ffffffff",
                    borderColor: "#ffffffff",
                    color: "black",
                  }}
                >
                  Previous
                </Button>
                <span className="exercise-name fs-3">
                  <b>{getCurrentExerciseName()}</b>
                </span>
                <Button
                  id="nextButton"
                  variant="secondary"
                  onClick={handleNext}
                  style={{
                    backgroundColor: "#ffffffff",
                    borderColor: "#ffffffff",
                    color: "black",
                  }}
                >
                  Next
                </Button>
              </div>

              {/* Recording and CSV buttons */}
              <div
                className="d-flex justify-content-center align-items-center mt-3"
                style={{ gap: "5px" }}
              >
                <Button
                  id="startRecordingButton"
                  ref={startRecordingButtonRef}
                  variant="secondary"
                  size="sm"
                  style={{
                    backgroundColor: "#0284c7",
                    borderColor: "#2563eb",
                    color: "white",
                    fontSize: "14px",
                    padding: "5px 10px",
                  }}
                >
                  Start Recording
                </Button>
                <Button
                  id="stopRecordingButton"
                  ref={stopRecordingButtonRef}
                  disabled
                  variant="secondary"
                  size="sm"
                  style={{
                    backgroundColor: isRecording ? "#dc3545" : "#0284c7",
                    borderColor: isRecording ? "#dc3545" : "#9ca3af",
                    color: "white",
                    fontSize: "14px",
                    padding: "5px 10px",
                  }}
                >
                  Stop Recording
                </Button>

              {/* Download CSV Button */}
              <Button
                id="downloadCsvButton"
                variant="success"
                size="sm"
                onClick={handleOutputLog}
                style={{
                  fontSize: "14px",
                  padding: "5px 10px",
                  marginLeft: "20px",
                }}
              >
                Download CSV
              </Button>
              </div>
            </div>

            {/* Recording Preview - moved below all buttons */}
            <section
              ref={videoContainerRef}
              style={{
                display: "none",
                width: "100%",
                textAlign: "center",
                position: "relative",
                marginTop: "48px",
              }}
            >
              <h3
                className="fs-3"
                style={{
                  marginBottom: "20px",
                }}
              >
                <b>Recording Preview</b>
              </h3>
              <div
                className="bg-gray" // Use same bg-gray class for consistency
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                }}
              >
                <video
                  ref={videoTargetRef}
                  loop
                  controls
                  autoPlay
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "10px",
                    border: "2px solid #e5e7eb",
                  }}
                ></video>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Button ref={downloadButtonRef} variant="success">
                  Download Video
                </Button>
              </div>
            </section>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Demo;
