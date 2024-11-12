import express from 'express';
import messageRoutes from './routes/message.js';

const app = express();

app.use(express.json());
app.use('/message', messageRoutes);

export default app;