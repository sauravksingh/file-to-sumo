const fs = require('fs'),
    path = require('path'),
    Tail = require('node.tail');

const LoggerService = require('./loggerservice.js');
let loggerService;

class LogController {
    constructor() {
        if (!LogController.logController) {
            LogController.logController = this;
        }
        return LogController.logController;
    }

    streamLogs(config) {
        this.validateConfig(config);
        loggerService = new LoggerService(config);
        const absolutePath = path.resolve(config.logFilePath);
        if (!absolutePath || !fs.existsSync(absolutePath)) {
            throw new Error('Given log file does not exists.');
        }
        const tailFile = new Tail(absolutePath, {
            buffer: config.memoryBufferInBytes || 63 * 1024 - 1,
            sep: config.logSeparator || '\n',
            lines: config.lineBuffer || 100,
            follow: config.follow || true,
            sleep: config.sleepIntervalInMilliSeconds || 500
        });
        tailFile.on('line', (line) => {
            loggerService.log(line);
        });
        tailFile.on('error', console.error);
    };

    flushLogs() {
        if (loggerService instanceof LoggerService) {
            loggerService.flushLogs();
        }
    }

    validateConfig(config) {
        if (!config || !config.sumoEndpoint || !config.logFilePath) {
            throw new Error('Invalid configuration: Missing required config parameters sumoEndpoint/logFilePath');
        }
    }
}

const logController = new LogController();
Object.freeze(logController);

module.exports = logController;