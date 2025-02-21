// src/utilities/loggerUtility.js

import { Platform } from 'react-native';

// Unique prefixes for API and general logs
const API_LOG_PREFIX = '🌐 [API]';
const GENERAL_LOG_PREFIX = '🔹[APP LOG]';

// Log levels
const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

/**
 * Format log message with consistent structure and identifiers.
 * @param {string} prefix - Log prefix for easy identification.
 * @param {string} level - The log level (DEBUG, INFO, WARN, ERROR)
 * @param {string} message - Main log message
 * @param {Object} [details] - Additional log details
 * @returns {string} - Formatted log message
 */
const formatMessage = (prefix, level, message, details = {}) => {
  const timestamp = new Date().toISOString();
  const platform = Platform.OS.toUpperCase();
  return `${prefix} [${timestamp}][${platform}][${level}] ${message} ${
    Object.keys(details).length ? JSON.stringify(details) : ''
  }`;
};

/**
 * Core logging function for printing formatted messages to the console.
 * @param {string} prefix - Log prefix
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} [details] - Optional additional details
 */
const log = (prefix, level, message, details = {}) => {
  const formattedMessage = formatMessage(prefix, level, message, details);

  switch (level) {
    case LOG_LEVELS.DEBUG:
      console.debug(formattedMessage);
      break;
    case LOG_LEVELS.INFO:
      console.info(formattedMessage);
      break;
    case LOG_LEVELS.WARN:
      console.warn(formattedMessage);
      break;
    case LOG_LEVELS.ERROR:
      console.error(formattedMessage);
      break;
    default:
      console.log(formattedMessage);
  }
};

// Main Logger object with general and API-specific log methods
const Logger = {
  // General logs
  debug: (message, details) => log(GENERAL_LOG_PREFIX, LOG_LEVELS.DEBUG, message, details),
  info: (message, details) => log(GENERAL_LOG_PREFIX, LOG_LEVELS.INFO, message, details),
  warn: (message, details) => log(GENERAL_LOG_PREFIX, LOG_LEVELS.WARN, message, details),
  error: (message, details) => log(GENERAL_LOG_PREFIX, LOG_LEVELS.ERROR, message, details),

  // API-specific logs
  api: {
    request: (url, config) => log(API_LOG_PREFIX, LOG_LEVELS.INFO, `Request to ${url}`, config),
    response: (url, response) => log(API_LOG_PREFIX, LOG_LEVELS.INFO, `Response from ${url}`, response),
    error: (url, error) => log(API_LOG_PREFIX, LOG_LEVELS.ERROR, `Error from ${url}`, { message: error.message, stack: error.stack }),
  },
};

export { Logger };

/* Example Usage:
   import { Logger } from './utilities/loggerUtility';

   // General app logs
   Logger.debug('Fetching user data');
   Logger.info('User logged in', { userId: '12345', name: 'John Doe' });
   Logger.warn('Low memory warning', { availableMemory: '50MB' });
   Logger.error('API request failed', { statusCode: 500 });

   // API logs within Axios interceptors
   import axios from 'axios';
   import { Logger } from './utilities/loggerUtility';

   const apiClient = axios.create();

   apiClient.interceptors.request.use(config => {
     Logger.api.request(config.url, config);
     return config;
   });

   apiClient.interceptors.response.use(
     response => {
       Logger.api.response(response.config.url, response);
       return response;
     },
     error => {
       Logger.api.error(error.config?.url, error);
       return Promise.reject(error);
     }
   );

Expected Console Output:
  🔹[APP LOG] [2024-10-10T14:48:00.000Z][IOS][DEBUG] Fetching user data
  🔹[APP LOG] [2024-10-10T14:48:01.000Z][IOS][INFO] User logged in {"userId":"12345","name":"John Doe"}
  🌐 [API] [2024-10-10T14:48:02.000Z][IOS][INFO] Request to /api/users {"method":"GET","headers":{...}}
  🌐 [API] [2024-10-10T14:48:03.000Z][IOS][INFO] Response from /api/users {"status":200,"data":{...}}
  🌐 [API] [2024-10-10T14:48:04.000Z][IOS][ERROR] Error from /api/users {"message":"Request failed","stack":"..."}
*/
