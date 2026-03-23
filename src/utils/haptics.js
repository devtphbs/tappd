// Haptic feedback utilities for iOS-style interactions
export const triggerHaptic = (type = 'light') => {
  if (!window.navigator.vibrate) return;

  const patterns = {
    light: [10],
    medium: [20],
    heavy: [40],
    success: [10, 50, 10],
    error: [100],
    warning: [50],
    selection: [5],
    impact: [15],
  };

  const pattern = patterns[type] || patterns.light;
  
  try {
    window.navigator.vibrate(pattern);
  } catch (error) {
    console.log('Haptic feedback not supported');
  }
};

// Haptic feedback for different interactions
export const haptics = {
  // Button interactions
  buttonPress: () => triggerHaptic('light'),
  buttonLongPress: () => triggerHaptic('medium'),
  
  // Form interactions
  inputFocus: () => triggerHaptic('selection'),
  inputError: () => triggerHaptic('error'),
  formSubmit: () => triggerHaptic('success'),
  
  // Navigation
  tabSwitch: () => triggerHaptic('selection'),
  pageLoad: () => triggerHaptic('light'),
  
  // Actions
  save: () => triggerHaptic('success'),
  delete: () => triggerHaptic('heavy'),
  refresh: () => triggerHaptic('medium'),
  
  // Notifications
  notification: () => triggerHaptic('warning'),
  alert: () => triggerHaptic('error'),
  
  // Camera
  cameraShutter: () => triggerHaptic('heavy'),
  cameraFocus: () => triggerHaptic('light'),
  
  // Scanning
  scanComplete: () => triggerHaptic('success'),
  scanError: () => triggerHaptic('error'),
};

// Add haptic feedback to React components
export const addHapticFeedback = (element, type = 'buttonPress') => {
  if (!element) return;
  
  const handleInteraction = () => {
    haptics[type]();
  };
  
  element.addEventListener('click', handleInteraction);
  element.addEventListener('touchstart', handleInteraction);
  
  return () => {
    element.removeEventListener('click', handleInteraction);
    element.removeEventListener('touchstart', handleInteraction);
  };
};
