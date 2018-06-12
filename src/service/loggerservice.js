const fs = require("fs"),
    path = require("path"),
    SumoLogger = require("sumo-logger"),
    uuidv4 = require("uuid/v4");

const LOG_FAILURE_PATH = "./logfailures.log";

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
        let sumoLoggerOptions = {};
        sumoLoggerOptions["endpoint"] = opts.sumoEndpoint;
        sumoLoggerOptions["clientUrl"] = opts.sumoClientUrl;
        sumoLoggerOptions["interval"] = opts.sumoInterval;
        sumoLoggerOptions["hostName"] = opts.sumoHostName;
        sumoLoggerOptions["sourceName"] = opts.sumoSourceName;
        sumoLoggerOptions["sourceCategory"] = opts.sumoSourceCategory;
        sumoLoggerOptions["sessionKey"] = uuidv4();
        sumoLoggerOptions["onSuccess"] = () => {};
        sumoLoggerOptions["onError"] = (err) => {
            const absolutePath = path.resolve(LOG_FAILURE_PATH);
            fs.writeFile(absolutePath, this.prepareErrorLog(err, opts), 'utf8', (err) => {
                if (err) throw err
            })
        };
        return sumoLoggerOptions;
    }

    log(message) {
        this.sumoLogger.log(message)
    };

    flushLogs(){
        this.sumoLogger.flushLogs();
    }

    prepareErrorLog(err, opts) {
        let log = {};
        log["timestamp"] = new Date().toISOString();
        log["error"] = err;
        log["endpoint"] = opts.sumoEndpoint;
        return JSON.stringify(log) + "\r\n";
    }
}

module.exports = LoggerService;