import dotenv from 'dotenv';
import express from 'express';
import { registerRoutes } from './routes';

dotenv.config();
const app = express();

app.use(express.json());

const port = process.env.PORT || 3001;
const env = process.env.NODE_ENV || "development";

app.listen(port, async () => {
    console.info(`Server Running in: ${env} and listening on port:${port}`);
});

registerRoutes(app);

export default app;
