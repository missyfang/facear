export type LensConfig = {
  lensID: string;
  name: string;
  description: string;
  features: {
    exerciseTypes: string[];
    showBilateralToggles: boolean;
    showSensitivitySlider: boolean;
    showRepsAndSets: boolean;
    showDuration: boolean;
    showSpeedSlider?: boolean;
  };
};

export const lensConfigs: Record<string, LensConfig> = {
  basic: {
    lensID: "2317d687-d5ce-4ccf-95ce-06ab74358a93",
    name: "Basic Lens",
    description: "In this exercise, you will have three sample facial exercises to explore FaceAR features using your WebCam. After starting the exercise, you can adjust your sensitivity level and switch to unilateral mode in the setting panel.",
    features: {
      exerciseTypes: ["repetitive"],
      showBilateralToggles: true,
      showSensitivitySlider: true,
      showRepsAndSets: true,
      showDuration: false,
      showSpeedSlider: false,
    }
  },
  jumpGame: {
    lensID: "0b504864-00df-4321-8fdf-0c86bd5bcfaa",
    name: "Jump Game",
    description: "In this exercise, you will play a jump game using your facial expressions. You can jump by raising your eyebrows. Try to avoid the obstacles! You can adjust the sensitivity level, game speed, and select the available exercises in the setting panel.",
    features: {
      exerciseTypes: ["game"],
      showBilateralToggles: true,
      showSensitivitySlider: true,
      showRepsAndSets: true,
      showDuration: false,
      showSpeedSlider: true,
    }
  },
  timer: {
    lensID: "623ea02f-ff58-48ce-a42d-badce1fecdb6",
    name: "Timer Exercise",
    description: "In this exercise, you will perform a timed facial exercise. You need to focus on sustained facial expressions and muscle endurance. After starting the exercise, you can adjust your sensitivity level, switch to unilateral mode, and select the available exercises in the setting panel.",
    features: {
      exerciseTypes: ["timer"],
      showBilateralToggles: true,
      showSensitivitySlider: true,
      showRepsAndSets: false,
      showDuration: true,
      showSpeedSlider: false,
    }
  },
  lip: {
    lensID: "00120037-aec6-4798-8212-ffe013f704e8",
    name: "Lip Exercise",
    description: "In this exercise, you will focus on lip-related facial exercises. After starting the exercise, you can adjust your sensitivity level and switch to unilateral mode in the setting panel.",
    features: {
      exerciseTypes: ["repetitive"],
      showBilateralToggles: true,
      showSensitivitySlider: true,
      showRepsAndSets: true,
      showDuration: false,
      showSpeedSlider: false,
    }
  },
  eyeAndBrow: {
    lensID: "54c0c4ce-d0d0-4cb7-9845-e0a322dc8249",
    name: "Eye and Brow Exercise",
    description: "In this exercise, you will focus on eye and eyebrow-related facial exercises. After starting the exercise, you can adjust your sensitivity level and switch to unilateral mode in the setting panel.",
    features: {
      exerciseTypes: ["repetitive"],
      showBilateralToggles: true,
      showSensitivitySlider: true,
      showRepsAndSets: true,
      showDuration: false,
      showSpeedSlider: false,
    }
  }
};