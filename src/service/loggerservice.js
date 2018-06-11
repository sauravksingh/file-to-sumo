const fs = require("fs"),
    SumoLogger = require("sumo-logger"),
    uuidv4 = require("uuid/v4");

class LoggerService {
    constructor(opts) {
        if (!LoggerService.loggerInstance) {
            this.opts = this.initOptions(opts);
            this.sumoLogger = new SumoLogger(this.opts);
            LoggerService.loggerInstance = this;
        }
        return LoggerService.loggerInstance;
    }

    initOptions(opts) {
        opts["sessionKey"] = uuidv4();
        opts["onSuccess"] = () => {};
        opts["onError"] = (err) => {
            fs.appendFile("./loggingfailures.log", this.prepareErrorLog(err, opts), 'utf8', (err) => {
                if (err) {
                    throw new Error("Error in writing logging failures");
                }
            });
        };
        return opts;
    }

    log(message) {
        this.sumoLogger.log(message)
    };

    prepareErrorLog(err, opts) {
        let log = {};
        log["timestamp"] = new Date().toISOString();
        log["error"] = err;
        log["opts"] = opts;
        return log + "\r\n";
    }
}

module.exports = LoggerService;