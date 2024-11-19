import express from 'express';
import dotenv from 'dotenv';
import { connectMongoDB, connectRedis } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Connect to databases
connectMongoDB();
connectRedis();

app.get("/",(req,res)=>{
    res.status(200).send("server is healthy..🌐");
})

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
