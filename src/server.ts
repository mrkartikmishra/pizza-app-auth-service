import app from './app';
import { Config } from './config';

function startServer() {
    try {
        const PORT = Config.PORT;

        app.listen(PORT, () => {
            console.log(`Server listening on PORT ${PORT}`);
        });
    } catch (err) {
        console.log('ERROR Occurred::', err);
        process.exit(1);
    }
}

startServer();
