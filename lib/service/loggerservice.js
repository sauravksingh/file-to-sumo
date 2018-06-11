"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require("fs"),
    SumoLogger = require("sumo-logger"),
    uuidv4 = require("uuid/v4");

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

            opts["sessionKey"] = uuidv4();
            opts["onSuccess"] = function () {};
            opts["onError"] = function (err) {
                fs.appendFile("./loggingfailures.log", _this.prepareErrorLog(err, opts), 'utf8', function (err) {
                    if (err) {
                        throw new Error("Error in writing logging failures");
                    }
                });
            };
            return opts;
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
            log["opts"] = opts;
            return log + "\r\n";
        }
    }]);

    return LoggerService;
}();

module.exports = LoggerService;