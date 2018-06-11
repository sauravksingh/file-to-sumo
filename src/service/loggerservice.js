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
            fs.appendFile("./loggingfailures.log",  err, 'utf8');
        };
        return opts;
    }

    log(message) {
        this.sumoLogger.log(message)
    };    
}

module.exports = LoggerService;