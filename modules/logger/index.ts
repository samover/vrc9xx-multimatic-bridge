import * as Logger from 'bunyan';

const getLogLevel = (): Logger.LogLevel => {
    // @ts-ignore
    if (process.env.LOG_LEVEL && Logger.levelFromName[process.env.LOG_LEVEL]) { return process.env.LOG_LEVEL as Logger.LogLevel; }
    return Logger.INFO;
};

export const LOGGER: Logger = Logger.createLogger({
    level: getLogLevel(),
    name: 'MultiMatic',
});
