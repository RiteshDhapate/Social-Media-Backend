import { redisClient } from '../config/db.js';

export const getCachedData = async (key) => {
  const cachedData = await redisClient.get(key);
  return cachedData ? JSON.parse(cachedData) : null;
};

export const setCacheData = async (key, data, ttl = 600) => {
  await redisClient.setEx(key, ttl, JSON.stringify(data));
};

export const invalidateCache = async (keys) => {
  for (const key of keys) {
    await redisClient.del(key);
  }
};
