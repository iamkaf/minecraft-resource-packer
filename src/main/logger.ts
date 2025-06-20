import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';

const logDir = path.join(app.getPath('userData'), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    new transports.File({
      filename: path.join(logDir, 'app.log'),
      maxsize: 1024 * 1024,
      maxFiles: 5,
    }),
    new transports.Console(),
  ],
});

export function registerLogHandler(ipc: import('electron').IpcMain) {
  ipc.handle('log', (_e, level: string, message: string) => {
    logger.log({ level, message });
  });
}

export default logger;
