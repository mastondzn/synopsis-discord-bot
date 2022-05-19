import type { RedisOptions } from 'ioredis';
import Redis from 'ioredis';
import isDocker from 'is-docker';

export const makeRedisDB = async (
    options?: RedisOptions,
    includeEnvironmentAsDefaults = true,
) => {
    options = includeEnvironmentAsDefaults
        ? {
              password: process.env.REDIS_PASSWORD,
              host: isDocker() ? 'redis' : 'localhost',
              ...options,
          }
        : { ...options };

    const redis = new Redis({ ...options, lazyConnect: true });

    await redis.connect();
    return redis;
};
