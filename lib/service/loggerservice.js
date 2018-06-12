"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require("fs"),
    path = require("path"),
    SumoLogger = require("sumo-logger"),
    uuidv4 = require("uuid/v4");

var LOG_FAILURE_PATH = "./logfailures.log";

var LoggerService = function () {
    function LoggerService(opts) {
        _classCallCheck(this, LoggerService);

        if (!LoggerService.loggerInstance) {
            this.opts = this.initOptions(opts);
            this.sumoLogger = new SumoLogger(this.opts);
            LoggerService.loggerInstance = this;
        }
        return LoggerService.loggerInstance;
    }

    _createClass(LoggerService, [{
        key: "initOptions",
        value: function initOptions(opts) {
            var _this = this;

            var sumoLoggerOptions = {};
            sumoLoggerOptions["endpoint"] = opts.sumoEndpoint;
            sumoLoggerOptions["clientUrl"] = opts.sumoClientUrl;
            sumoLoggerOptions["interval"] = opts.sumoInterval;
            sumoLoggerOptions["hostName"] = opts.sumoHostName;
            sumoLoggerOptions["sourceName"] = opts.sumoSourceName;
            sumoLoggerOptions["sourceCategory"] = opts.sumoSourceCategory;
            sumoLoggerOptions["sessionKey"] = uuidv4();
            sumoLoggerOptions["onSuccess"] = function () {};
            sumoLoggerOptions["onError"] = function (err) {
                var absolutePath = path.resolve(LOG_FAILURE_PATH);
                fs.writeFile(absolutePath, _this.prepareErrorLog(err, opts), 'utf8', function (err) {
                    if (err) throw err;
                });
            };
            return sumoLoggerOptions;
        }
    }, {
        key: "log",
        value: function log(message) {
            this.sumoLogger.log(message);
        }
    }, {
        key: "prepareErrorLog",
        value: function prepareErrorLog(err, opts) {
            var log = {};
            log["timestamp"] = new Date().toISOString();
            log["error"] = err;
            log["endpoint"] = opts.sumoEndpoint;
            return JSON.stringify(log) + "\r\n";
        }
    }]);

    return LoggerService;
}();

module.exports = LoggerService;