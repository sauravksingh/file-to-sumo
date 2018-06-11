"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require("path"),
    Tail = require("node.tail");

var LoggerService = require("./loggerservice.js");

var LogController = function () {
    function LogController() {
        _classCallCheck(this, LogController);

        if (!LogController.logController) {
            LogController.logController = this;
        }
        return LogController.logController;
    }

    _createClass(LogController, [{
        key: "streamLogs",
        value: function streamLogs(config) {
            this.validateConfig(config);
            var loggerService = new LoggerService(config);
            var absolutePath = path.resolve(config.logfile);
            var tailFile = new Tail(absolutePath, {
                buffer: config.memorybuffer || 63 * 1024 - 1,
                sep: config.separator || '\n',
                lines: config.linebuffer || 20,
                follow: config.follow || true,
                sleep: config.sleep || 500
            });
            tailFile.on("line", function (line) {
                loggerService.log(line);
            });
            tailFile.on('error', console.error);
        }
    }, {
        key: "validateConfig",
        value: function validateConfig(config) {
            if (!config || !config.endpoint || !config.logfile) {
                throw new Error("Invalid/Incomplete configuration");
            }
            return true;
        }
    }]);

    return LogController;
}();

var logController = new LogController();
Object.freeze(logController);

module.exports = logController;