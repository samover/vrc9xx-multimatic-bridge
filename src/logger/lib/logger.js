"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger = require("bunyan");
const getLogLevel = () => {
    // @ts-ignore
    if (process.env.LOG_LEVEL && Logger.levelFromName[process.env.LOG_LEVEL]) {
        return process.env.LOG_LEVEL;
    }
    return Logger.INFO;
};
exports.LOGGER = Logger.createLogger({
    level: getLogLevel(),
    name: 'JMC',
});
//# sourceMappingURL=logger.js.map