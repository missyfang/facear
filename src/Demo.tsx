import './Demo.css';
import { Container, Row, Col, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useEffect } from 'react';
import { useState } from 'react';
import { renderAR } from './renderAR';
import { bootstrapCameraKit, createMediaStreamSource } from '@snap/camera-kit';
import { useRef } from 'react';
import { demoExercises } from './ExerciseList';

function Demo() {
  type LensData = {
    completedReps?: number;
  };

  const [lensData, setLensData] = useState<LensData | null>(null);
  const [sensitivity, setSensitivity] = useState("0.5");
  const [isStarted, setIsStarted] = useState(false);
  const [isLeftOn, setIsLeftOn] = useState(true);
  const [isRightOn, setIsRightOn] = useState(true);
  const [tooltipPosition, setTooltipPosition] = useState({ left: "50%" });
  const [exerciseType, setExerciseType] = useState('timer'); // Default exercise type
  const [exerciseDuration, setExerciseDuration] = useState("10"); // Default timer value in seconds
  const [reps, setReps] = useState("10"); // Default number of reps
  const [sets, setSets] = useState("3");  // Default number of sets
  const liveRenderTarget = document.getElementById('canvas') as HTMLCanvasElement;
  
  const videoContainer = document.getElementById(
    'video-container'
  ) as HTMLElement;

  const videoTarget = document.getElementById('video') as HTMLVideoElement;
  
  const startRecordingButton = document.getElementById(
    'start'
  ) as HTMLButtonElement;
 
  const stopRecordingButton = document.getElementById(
    'stop'
  ) as HTMLButtonElement;
  
  const downloadButton = document.getElementById('download') as HTMLButtonElement;
  
  let downloadUrl: string;
  
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoTargetRef = useRef<HTMLVideoElement | null>(null);
  const startRecordingButtonRef = useRef<HTMLButtonElement | null>(null);
  const stopRecordingButtonRef = useRef<HTMLButtonElement | null>(null);
  const downloadButtonRef = useRef<HTMLButtonElement | null>(null);
  let mediaRecorder: MediaRecorder;

  useEffect(() => {
      renderAR(setLensData);
    init();
  }, []);
  
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
      setIsStarted(true)
    };

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target;
      setSensitivity(input.value);
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

    const handleExerciseTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setExerciseType(event.target.value);
    };

    const handleUpdate = () => {
      console.log("Settings updated:", {
        sensitivity,
        exerciseType,
        exerciseDuration,
        reps,
        sets,
        isLeftOn,
        isRightOn
      });
    };

    async function init() {
      const cameraKit = await bootstrapCameraKit({
        apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzE1NjQwNjk0LCJzdWIiOiI5YmFmZmI5Ni01ZDNlLTQ2MzUtYmIwNC00ZGFhYzNiZmQ0YTh-U1RBR0lOR345ZjJkN2Q5Ni00OTdkLTQ1YjYtODcxYy1mZDg4MzcxYjRmNTYifQ.k-Rl8uGTuACnIfjZrjMi4OSC26OStxBF6wjipB_hDYI',
      });
    
      const session = await cameraKit.createSession({ liveRenderTarget });
    
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
    
      const source = createMediaStreamSource(mediaStream);
    
      await session.setSource(source);
      await session.play();
    
      const { lenses } = await cameraKit.lensRepository.loadLensGroups([
        '1002ed8b-a97a-42f0-842f-21b57f4a8a42',
      ]);
    
      session.applyLens(lenses[0]);
    
    }
    
    function bindRecorder() {
      if (!startRecordingButtonRef.current || !stopRecordingButtonRef.current || !downloadButtonRef.current || !videoContainerRef.current || !videoTargetRef.current) {
        console.error("One or more elements are missing");
        return;
      }
  
      startRecordingButtonRef.current.addEventListener('click', () => {
        startRecordingButtonRef.current!.disabled = true;
        stopRecordingButtonRef.current!.disabled = false;
        downloadButtonRef.current!.disabled = true;
        videoContainerRef.current!.style.display = 'none';
  
        const mediaStream = document.querySelector('canvas')!.captureStream(30);
        mediaRecorder = new MediaRecorder(mediaStream);
  
        mediaRecorder.addEventListener('dataavailable', (event) => {
          if (!event.data.size) {
            console.warn('No recorded data available');
            return;
          }
  
          const blob = new Blob([event.data]);
          downloadUrl = window.URL.createObjectURL(blob);
          downloadButtonRef.current!.disabled = false;
  
          videoTargetRef.current!.src = downloadUrl;
          videoContainerRef.current!.style.display = 'block';
        });
  
        mediaRecorder.start();
      });
  
      stopRecordingButtonRef.current.addEventListener('click', () => {
        startRecordingButtonRef.current!.disabled = false;
        stopRecordingButtonRef.current!.disabled = true;
        mediaRecorder?.stop();
      });
  
      downloadButtonRef.current.addEventListener('click', () => {
        const link = document.createElement('a');
        link.setAttribute('style', 'display: none');
        link.href = downloadUrl;
        link.download = 'camera-kit-web-recording.webm';
        link.click();
        link.remove();
      });
    }
  
    
    

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
      const lensValues = Object.keys(lensData).map((key) => (lensData as any)[key]);
      const exerciseValues = demoExercises.map((exercise) => [
        exercise.Name,
        exercise.ExerciseType,
        sensitivity, // Difficulty level
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
      const timestamp = now.toISOString()
        .replace(/T/, '_') 
        .replace(/:/g, '-')      
        .replace(/\..+/, '');
    
      const filename = `lensData_${timestamp}.csv`;
    
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    
      URL.revokeObjectURL(url);
    };
    

    return (
      <Container className="px-4">
        <div className="top-right-text">
          {lensData?.completedReps ?? 'Loading...'}
        </div>
        <Row className="justify-content-center">
          <Col className="text-start fs-1" style={{ marginLeft: '65px' }}>
            <b><span className='gradient-text'>Demo</span></b>
          </Col>
        </Row>

      {!isStarted ? (
        // Before clicking the start button, show the exercise description
        <Row>
        <Col md={3} className="exercise-panel bg-gray" style={{ marginLeft: '-300px' }}>
          <h2 className="fs-3"><b>Sample Exercise</b></h2>
          <hr className="separator" />
          <p className="exercise-description">
              In this exercise, you will have three sample facial exercises to explore FaceAR features using your WebCam. After starting the exercise, you can adjust your sensitivity level and switch to unilateral mode in the setting panel.
          </p>
        </Col>
        
        <Col md={8} className="text-center">
          <div className="bg-gray" id="canvas-container" style={{ minWidth: '1315px'}}></div>
          <div style={{ width: '1315px', margin: '0 auto' }}>
            <Button
              id="startButton"
              variant="primary" 
              onClick={handleStart} 
              disabled={isStarted}
              className="start-button w-50 mt-3"
            >
              Start
            </Button>
          </div>
        </Col>
      </Row>
      ):(
        //After clicking the Start button, show the setting panel and change the button to "next" and "previous"
        <Row>
          <Col md={3} className="settings-panel bg-gray p-3"  style={{ marginLeft: '-300px'}}>
            <h2 className="fs-3"><b>Settings</b></h2>
            <p className="setting-description">
              In this setting panel, you will be able to adjust the sensitivity level through the slider below and toggle the bilateral setting buttons
            </p>

            <hr className="separator" />
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-top">
                  <div
                    style={{
                      position: "absolute",
                      top: "-30px",
                      left: tooltipPosition.left,
                      background: "#fef500",
                      color: "#000",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    {sensitivity}
                  </div>
                </Tooltip>
              }
            >
              <Form.Range
                id="mySensitivity"
                min={0}
                max={1}
                step={0.1}
                value={sensitivity}
                onChange={handleSliderChange}
              />
            </OverlayTrigger>
            <Form.Label className="sensitivity-label">Sensitivity
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-top">
                  Adjusts the sensitivity of the AR lens detection.
                </Tooltip>
              }
            >
              <span className="sensitivity-infoIcon">
                &#9432; {/* Unicode for a small 'info' symbol */}
              </span>
            </OverlayTrigger>
            </Form.Label>

            <hr className="separator" />
            {/* Dropdown to select exercise type */}
            <Form.Group controlId="exerciseTypeSelect" className="mb-3">
              <Form.Label><b>Select Exercise Type</b></Form.Label>
              <Form.Select value={exerciseType} onChange={handleExerciseTypeChange}>
                <option value="timer">Timer Type</option>
                <option value="repetitive">Repetitive Exercise Type</option>
              </Form.Select>
            </Form.Group>

            {/* Conditional rendering based on exercise type */}
            {exerciseType === 'timer' && (
              <Form.Group controlId="exerciseDuration" className="mb-3">
                <Form.Label><b>Exercise Duration (seconds)</b></Form.Label>
                <Form.Control
                    type="number"
                    min={10}
                    value={exerciseDuration}
                    onChange={(e) => setExerciseDuration(e.target.value)}
                  />
                <Form.Text>{exerciseDuration} seconds</Form.Text>
              </Form.Group>
            )}

            {exerciseType === 'repetitive' && (
              <div>
                <Form.Group controlId="exerciseReps" className="mb-3">
                  <Form.Label><b>Number of Repetitions</b></Form.Label>
                  <Form.Control
                    type="number"
                    id="numReps"
                    min={1}
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="exerciseSets" className="mb-3">
                  <Form.Label><b>Number of Sets</b></Form.Label>
                  <Form.Control
                    type="number"
                    id="numSets"
                    min={1}
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                  />
                </Form.Group>
              </div>
            )}

            <hr className="separator" />
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
              <div className="switch-label">Right 
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip-top">
                    Adjusts the bilateral setting of the lens
                  </Tooltip>
                }
              >
                <span className = "switch-infoIcon">
                  &#9432; {/* Unicode for a small 'info' symbol */}
                </span>
              </OverlayTrigger>
              </div>
            </Col>
            </Row>
            <hr className="separator" />
          </Col>
          
          <Col md={8} className="text-center">
            <div className="bg-gray" id="canvas-container" style={{ minWidth: '1315px'}}></div>
            <div style={{ width: '1315px', margin: '0 auto', position: 'relative' }}>
              <div className="d-flex justify-content-center align-items-center mt-4" style={{ gap: '20px' }}>
                <Button id="prevButton" variant="secondary" onClick={handlePrevious}>
                  Previous
                </Button>
                <span className="exercise-name fs-4"><b>Sample Exercise</b></span>
                <Button id="nextButton" variant="secondary" onClick={handleNext}>
                  Next
                </Button>
              </div>
              <div style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)' }}>
                <Button 
                  ref={startRecordingButtonRef} 
                  className="me-2"
                  variant="primary"
                >
                  Start Recording
                </Button>
                <Button 
                  ref={stopRecordingButtonRef} 
                  disabled
                  variant="secondary"
                >
                  Stop Recording
                </Button>
              </div>
              <div style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>
                <Button id="downloadCsvButton" variant="success" onClick={handleOutputLog}>
                  Download lensData (.csv)
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      )}
      
      <canvas id="canvas"></canvas>
      <section ref={videoContainerRef} style={{ 
        display: 'none',
        width: '1315px',
        margin: '0 auto',
        textAlign: 'center',
        marginTop: '20px',
        position: 'relative'
      }}>
        <video ref={videoTargetRef} loop controls autoPlay style={{
          maxWidth: '100%',
          height: 'auto'
        }}></video>
        <div style={{ 
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '10px'
        }}>
          <Button 
            ref={downloadButtonRef}
            variant="success"
          >
            Download Video
          </Button>
        </div>
      </section>
    </Container>
    
      );
}

export default Demo;