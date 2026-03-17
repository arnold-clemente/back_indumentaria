import { createServer } from './config/server';
import { env } from './config/env';
import { connectDB } from './config/database';

const startServer = async () => {

    await connectDB();

    const app = createServer();

    app.listen(env.PORT, () => {
        console.log(`✅ Server running on port ${env.PORT}`);
    });
};

startServer();
