export const ALERT_TYPE = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
    WARNING: "WARNING",
    INFO: "INFO",
    DEFAULT: "DEFAULT",
  };
  
  export const ALERT_CONFIG = {
    [ALERT_TYPE.SUCCESS]: {
      color: '#FFFFFF',
      backgroundColor: '#4CAF50', // Green
    },
    [ALERT_TYPE.ERROR]: {
      color: '#FFFFFF',
      backgroundColor: '#F44336', // Red
    },
    [ALERT_TYPE.WARNING]: {
      color: '#FFFFFF',
      backgroundColor: '#FF9800', // Orange
    },
    [ALERT_TYPE.INFO]: {
      color: '#FFFFFF',
      backgroundColor: '#2196F3', // Blue
    },
    [ALERT_TYPE.DEFAULT]: {
      color: '#000000',
      backgroundColor: '#FFFFFF', // White
    },
  };
  