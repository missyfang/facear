import { bootstrapCameraKit, createMediaStreamSource, estimateLensPerformance, Transform2D } from "@snap/camera-kit";
import {
  Injectable,
  RemoteApiService,
  RemoteApiServices,
  remoteApiServicesFactory,
} from '@snap/camera-kit';

export async function renderAR(setLensData: (value: object) => void) {

  type UIData = {
    elementName: string;
    value: string;
    pressed: boolean;
  };
    const remoteApiService: RemoteApiService = {
      //Nithisha apiSpecId
      //apiSpecId: '875c6c5a-44e1-4a38-b2cd-d2e57473c4c3',
      //placeholder apiSpecId
      //apiSpecId: '363ee2a5-ad35-4a5f-9547-d42b2c60a927',
      //Sensitivity apiSpecId
      apiSpecId: '266d9e05-8d86-4975-9729-6313b25651bd',
      getRequestHandler(request, lens) {
        if (request.endpointId === 'sendDataFromLens'){
          console.log(request.parameters);
          setLensData(request.parameters);
          return;
        }
        if (request.endpointId !== 'sensitivity') return;
  
        // Return a function that matches the RemoteApiRequestHandler type
        return (reply) => {
          
          const waitForInput = () => {
            return new Promise<UIData>((resolve) => {
              const startButton = document.getElementById('startButton');
              const sensitivityInput = document.getElementById('mySensitivity');
              const toggleLeft = document.getElementById('leftSwitch') as HTMLInputElement;
              const toggleRight = document.getElementById('rightSwitch') as HTMLInputElement;
              const prevButton = document.getElementById('prevButton');
              const nextButton = document.getElementById('nextButton');
              const numReps = document.getElementById('numReps') as HTMLInputElement;
              const numSets = document.getElementById('numSets') as HTMLInputElement;

              const handleClick = (event: Event) => {
                const buttonElement = event.target as HTMLButtonElement;
                resolve({
                  elementName: buttonElement.id,
                  value: "",
                  pressed: true,
                });
              };

              const handleToggle = (event: Event) => {
                const switchElement = event.target as HTMLInputElement;
                resolve({
                  elementName: switchElement.id,
                  value: "",
                  pressed: switchElement.checked,  // Capture the on/off state
                });
              };

              const handleInputChange = () => {
                resolve({
                  elementName: "setsAndReps",
                  value: JSON.stringify({
                    reps: numReps?.value || "5",
                    sets: numSets?.value || "3",
                  }),
                  pressed: false,
                });
              };

              if(startButton){
                //startButton.addEventListener('click', handleClick, { once: true });
                startButton.onclick = handleClick;
              }
              else if (sensitivityInput && toggleLeft && toggleRight && prevButton && nextButton){
                sensitivityInput.addEventListener('input', (event) => {
                  const inputElement = event.target as HTMLInputElement;
                  resolve({
                    elementName: "sensitivity",
                    value: inputElement.value,
                    pressed: false,
                  });
                  // prevents the promise from being resolved multiple times if the button is clicked more than once
                }, { once: true });
                toggleLeft.onchange = handleToggle;
                toggleRight.onchange = handleToggle;
                prevButton.onclick = handleClick;
                nextButton.onclick = handleClick;

                if (numReps && numSets) {
                  numReps.addEventListener('input', handleInputChange);
                  numSets.addEventListener('input', handleInputChange);
                }
              }
              else
                return;
            });
          };
          
         /*
          const waitForInput = () => {
            return new Promise<string>((resolve) => {
            const sensitivityInput = document.getElementById('mySensitivity');
            if (!sensitivityInput) return;
            sensitivityInput.addEventListener('input', (event) => {
              const inputElement = event.target as HTMLInputElement;
              resolve(inputElement.value);
              // prevents the promise from being resolved multiple times if the button is clicked more than once
            }, { once: true });
            });
          };
          */
         
          // Handle the asynchronous behavior without marking the function as async
          waitForInput().then((values) => {
            reply({
              status: 'success',
              metadata: {},
              body: new TextEncoder().encode(JSON.stringify(values)),
            });
          });
        };
      },
    };
  
  
    // Bootstrap the CameraKit Web SDK: Download WebAssembly runtime and configure SDK
    const cameraKit = await bootstrapCameraKit(
      {
        apiToken:
          "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzE1NjQwNjk0LCJzdWIiOiI5YmFmZmI5Ni01ZDNlLTQ2MzUtYmIwNC00ZGFhYzNiZmQ0YTh-U1RBR0lOR345ZjJkN2Q5Ni00OTdkLTQ1YjYtODcxYy1mZDg4MzcxYjRmNTYifQ.k-Rl8uGTuACnIfjZrjMi4OSC26OStxBF6wjipB_hDYI",
      },
      (container) =>
        container.provides(
          Injectable(
            remoteApiServicesFactory.token,
            [remoteApiServicesFactory.token] as const,
            (existing: RemoteApiServices) => [...existing, remoteApiService]
          )
        )
    );

    // Let CameraKit create a new canvas, then append it to the DOM
    const canvasContainer = document.getElementById("canvas-container");

    if(!canvasContainer) {
      return
    }

    // Create a CameraKitSession to render lenses
    const session = await cameraKit.createSession();
    canvasContainer.appendChild(session.output.live);
  
    // Give CameraKit SDK access to the user's webcam
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const source = createMediaStreamSource(stream, { transform: Transform2D.MirrorX, cameraType: 'user' });
    await session.setSource(source);
    await source.setRenderSize(window.innerWidth/1.8, window.innerHeight/1.5);
   
    // Loading a single lens and apply it to the session
    var lensID = "40476bf8-01c0-45d9-b082-74392206e5e2";
    var lensGroupID = "1002ed8b-a97a-42f0-842f-21b57f4a8a42";
    const lens = await cameraKit.lensRepository.loadLens(lensID, lensGroupID);
    await session.applyLens(lens, { launchParams: { text: "Some Text that we will use with a Lens" }});
    await session.play();
  }