import { AppDataSource } from './config/db';
import { Config } from './config';
import app from './app';
import logger from './config/logger';

function startServer() {
    try {
        const PORT = Config.PORT;

        AppDataSource.initialize();

        logger.info('Database connected successfully!!');

        app.listen(PORT, () => {
            logger.info(`Server listening on PORT`, { PORT: PORT });
        });
    } catch (err) {
        logger.error('ERROR Occurred::', { ERROR: err });
        process.exit(1);
    }
}

startServer();
