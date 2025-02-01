import Winston from 'winston';
import { Config } from '.';

const logger = Winston.createLogger({
    level: 'info',
    defaultMeta: {
        ServiceName: 'Auth-Service',
    },
    transports: [
        new Winston.transports.File({
            level: 'info',
            dirname: 'logs',
            filename: 'combined.log',
            format: Winston.format.combine(
                Winston.format.timestamp(),
                Winston.format.json(),
            ),
            silent: Config.NODE_ENV === 'test',
        }),
        new Winston.transports.File({
            level: 'error',
            dirname: 'logs',
            filename: 'app_error.log',
            format: Winston.format.combine(
                Winston.format.timestamp(),
                Winston.format.json(),
            ),
            silent: Config.NODE_ENV === 'test',
        }),
        new Winston.transports.Console({
            level: 'info',
            format: Winston.format.combine(
                Winston.format.timestamp(),
                Winston.format.json(),
            ),
            silent: Config.NODE_ENV === 'test',
        }),
    ],
});

export default logger;
