const path = require("path"),
    Tail = require("node.tail");

const LoggerService = require("./loggerservice.js");

class LogController {
    constructor() {
        if (!LogController.logController) {
            LogController.logController = this;
        }
        return LogController.logController;
    }

    streamLogs(config) {
        this.validateConfig(config);
        const loggerService = new LoggerService(config);
        const absolutePath = path.resolve(config.logFilePath);
        const tailFile = new Tail(absolutePath, {
            buffer: config.memoryBufferInBytes || 63 * 1024 - 1,
            sep: config.logSeparator || '\n',            
            lines: config.lineBuffer || 100,
            follow: config.follow || true,
            sleep: config.sleepIntervalInMilliSeconds || 500
        });
        tailFile.on("line", (line) => {         
            loggerService.log(line);
        });
        tailFile.on('error', console.error);
    };

    validateConfig(config) {
        if (!config || !config.sumoEndpoint || !config.logFilePath) {
            throw new Error("Invalid configuration: Missing required config parameters sumoEndpoint/logFilePath");
        }
        return true;
    }
}

const logController = new LogController();
Object.freeze(logController);

module.exports = logController;