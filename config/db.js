import mongoose from 'mongoose';
import { createClient } from 'redis';

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const redisClient = createClient({
    url:process.env.REDIS_URL
});
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected');
  } catch (error) {
    console.error(`Redis connection error: ${error.message}`);
    process.exit(1);
  }
};

export { connectMongoDB, connectRedis, redisClient };
