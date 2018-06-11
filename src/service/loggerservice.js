const SumoLogger = require("sumo-logger"),
    uuidv4 = require("uuid/v4"),
    logger = require("../../../config/logger.json"),
    credentials = require("../../../config/credentials.json");

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
            console.log("Sumo Logic error callback executed");
            throw new Error("Sumo Logic error callback executed");
        };
        return opts;
    }

    log(message) {
        this.sumoLogger.log(message)
    };    
}

module.exports = LoggerService;