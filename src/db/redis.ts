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
              ...options,
          }
        : { ...options };

    const redis = new Redis({ ...options, lazyConnect: true });

    await redis.connect();
    return redis;
};
