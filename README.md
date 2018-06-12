# file-to-sumo
### Stream logs from a file to SumoLogic hosted collector
------

The file-to-sumo library is a lightweight logging tool to tail/follow on a log file in real-time and forward custom log messages to [Sumo Logic](http://www.sumologic.com) hosted collector over HTTP. 

*Basics:*

All logs are sent as JSON objects. Fields called `sessionId`, `url`, and `timestamp` are sent in both cases.

Messages are batched and sent at the configured interval; default is zero, meaning messages are sent to the server on each call. You can force any queued messages to be sent, typically during a shutdown or logout flow.

### Table of Contents
* [Installation](#installation)
* [Usage](#usage)
    * [Configuration](#configuration)  
* [Usage Examples](#usage-examples)
* [License](#license)

## Installation

**Prerequisites**

You must have an HTTP source in your Sumo Logic account to use this SDK. To create one:
* log into Sumo Logic,
* go to the Manage Collection page, and,
* **either** add a new HTTP source to a new or existing Hosted Collector **or** select an existing HTTP source.

You’ll need the endpoint URL to configure the logger object. You can get it by clicking the `Show URL` link for the source on the Manage Collection page.

If you don't have a Sumo Logic account yes, you can easily create one by going to https://www.sumologic.com and clicking the Free Trial button--no cost, just enter your email.

You must also have Node.js/npm installed to use the SDK. [Node installation](https://docs.npmjs.com/getting-started/installing-node)

You must have a logger configured which logs events from your service/API to a log file with read-access to the file. The relative path to the log file must be passed as a config parameter to configure the logger to read the new log entries.

**Using NPM:**
```
$ npm install --save file-to-sumo
```

**From GitHub:**
* Download or clone this repo.
* Copy the folder named `lib` with files `service/logcontroller.js` and `service/loggerservice.js`   

## Usage

### Core function

* `streamLogs`: Set the configuration for streaming logs and starts streaming logs to configured [Sumo Logic](http://www.sumologic.com) collector
* `flushLogs` : Flush the remaining logs in the log buffer typically before finishing the session/shutdown

### Configuration

Before sending any messages, the API needs to be configured with required config parameters. Out of the following parameters, only `sumoEndpoint` and `logFilePath` are required and all others are optional.

*sumoEndpoint(Required)*

To send your logs, the API must know which HTTP Source to use. Pass this value (which you can get from the Collectors page) in the `sumoEndpoint` parameter. It's usually a URL of with the following pattern <https://endpoint1.collection.us2.sumologic.com/receiver/v1/xxxxxyxxxxyyyyxyyy>


*logFilePath(Required)*

To send your logs, the API must know which log file to follow. Pass the relative path of the log file as the value in the `logFilePath` parameter.
`"logFilePath" : "./yourservice.log"`

*sumoClientUrl(optional)*

You can provide a URL, which will be sent as the `url` field of the log line. 


*sumoInterval(optional)*

A number of milliseconds. Messages will be batched and sent at the interval specified. Default value is zero, meaning messages are sent each time `log()` is called.

*sumoHostName(optional)*

This value identifies the host from which the log is being sent.

*sumoSourceCategory(optional)*

This value sets the Source Category for the logged message.

*sumoSourceName(optional)*

This value sets the Source Name for the logged message.

*memoryBufferInBytes(optional)*

This value sets the size of the buffer to be used to hold the log messages for each interval. The default value is `63 * 1024 - 1`

*logSeparator(optional)*

The separator character to recognize new lines from the log file. The default value is newline `\n `

*lineBuffer(optional)*

This value identifies the number of lines to be checked in every poll. The default value is `10`

*follow(optional)*

This value sets whether the log file should be tailed\followed in real-time. The default value is `true`

*sleepIntervalInMilliSeconds(optional)*

This value sets the polling interval for tail\follow. The default value is `500`

## Usage Examples

**Full configuration:**

```javascript
  var opts = {
        "logFilePath" : "./your_service.log",
        "sumoEndpoint": "https://endpoint1.collection.us2.sumologic.com/receiver/v1/your_sumo_endpoint",
        "sumoClientUrl": "https://your_service.com",
        "sumoInterval": 10000,  
        "sumoSourceName": "sumo_sourcename",
        "sumoSourceCategory": "sumo_sourcecategory",
        "sumoHostName": "sumo_hostname",
        "memoryBufferInBytes": 65000,
        "logSeparator": "\n",
        "lineBuffer": 10,
        "follow": true,
        "sleepIntervalInMilliSeconds": 500
    };
```

**Node.js:**

***Logging***
```javascript
const fileToSumo = require("file-to-sumo");
const opts =  {
        "logFilePath" : "./your_service.log",
        "sumoEndpoint": "https://endpoint1.collection.us2.sumologic.com/receiver/v1/your_sumo_endpoint",
        "sumoClientUrl": "https://your_service.com"
        //Other options ......
};

fileToSumo.streamLogs(opts);

```

## License
Apache Software License, Version 2.0. Please visit <http://www.apache.org/licenses/LICENSE-2.0.txt> for details.