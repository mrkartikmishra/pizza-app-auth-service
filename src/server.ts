import app from './app';
import { Config } from './config';
import logger from './config/logger';

function startServer() {
    try {
        const PORT = Config.PORT;

        app.listen(PORT, () => {
            logger.info(`Server listening on PORT`, { PORT: PORT });
        });
    } catch (err) {
        logger.error('ERROR Occurred::', { ERROR: err });
        process.exit(1);
    }
}

startServer();
