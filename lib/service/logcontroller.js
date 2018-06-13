'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path'),
    Tail = require('node.tail');

var LoggerService = require('./loggerservice.js');
var loggerService = void 0;

var LogController = function () {
    function LogController() {
        _classCallCheck(this, LogController);

        if (!LogController.logController) {
            LogController.logController = this;
        }
        return LogController.logController;
    }

    _createClass(LogController, [{
        key: 'streamLogs',
        value: function streamLogs(config) {
            this.validateConfig(config);
            loggerService = new LoggerService(config);
            var absolutePath = path.resolve(config.logFilePath);
            var tailFile = new Tail(absolutePath, {
                buffer: config.memoryBufferInBytes || 63 * 1024 - 1,
                sep: config.logSeparator || '\n',
                lines: config.lineBuffer || 100,
                follow: config.follow || true,
                sleep: config.sleepIntervalInMilliSeconds || 500
            });
            tailFile.on('line', function (line) {
                loggerService.log(line);
            });
            tailFile.on('error', console.error);
        }
    }, {
        key: 'flushLogs',
        value: function flushLogs() {
            if (loggerService instanceof LoggerService) {
                loggerService.flushLogs();
            }
        }
    }, {
        key: 'validateConfig',
        value: function validateConfig(config) {
            if (!config || !config.sumoEndpoint || !config.logFilePath) {
                throw new Error('Invalid configuration: Missing required config parameters sumoEndpoint/logFilePath');
            }
        }
    }]);

    return LogController;
}();

var logController = new LogController();
Object.freeze(logController);

module.exports = logController;