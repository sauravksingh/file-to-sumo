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
        const absolutePath = path.resolve(config.logfile);
        const tailFile = new Tail(absolutePath, {
            buffer: config.memorybuffer || 63 * 1024 - 1,
            sep: config.separator || '\n',            
            lines: config.linebuffer || 20,
            follow: config.follow || true,
            sleep: config.sleep || 500
        });
        tailFile.on("line", (line) => {
            loggerService.log(line);
        });
        tailFile.on('error', console.error);
    };

    validateConfig(config) {
        if (!config || !config.endpoint || !config.logfile) {
            throw new Error("Invalid/Incomplete configuration.");
        }
        return true;
    }
}

const logController = new LogController();
Object.freeze(logController);

module.exports = logController;