const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logger = {
  log: (message, data = {}) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n${JSON.stringify(data, null, 2)}\n`;
    
    console.log(logMessage);
    
    fs.appendFileSync(
      path.join(logsDir, 'app.log'),
      logMessage
    );
  },
  
  error: (message, error) => {
    const timestamp = new Date().toISOString();
    const errorMessage = `[${timestamp}] ERROR: ${message}\n${error.stack || error}\n`;
    
    console.error(errorMessage);
    
    fs.appendFileSync(
      path.join(logsDir, 'error.log'),
      errorMessage
    );
  },
  
  warn: (message, data = {}) => {
    const timestamp = new Date().toISOString();
    const warnMessage = `[${timestamp}] WARNING: ${message}\n${JSON.stringify(data, null, 2)}\n`;
    
    console.warn(warnMessage);
    
    fs.appendFileSync(
      path.join(logsDir, 'warning.log'),
      warnMessage
    );
  }
};

module.exports = logger;
