import type { RedisOptions } from 'ioredis';
import Redis from 'ioredis';

export const makeRedisDB = async (
    options?: RedisOptions,
    includeEnvironmentAsDefaults = true,
) => {
    options = includeEnvironmentAsDefaults
        ? {
              host: process.env.REDIS_HOST,
              password: process.env.REDIS_PWD,
              port: Number.parseInt(process.env.REDIS_PORT, 10),
              ...options,
          }
        : { ...options };

    const redis = new Redis({ ...options, lazyConnect: true });

    await redis.connect();
    return redis;
};