import type { EntityClass } from '@mikro-orm/core';
import { MikroORM } from '@mikro-orm/core';
import type { MongoDriver } from '@mikro-orm/mongodb';

import type { MikroWithMongoDriverOptions } from '../utils/types/index';
import { entities } from './entities';

export const makeMikroORM = async (
    options?: MikroWithMongoDriverOptions,
    entities?: EntityClass<unknown>[],
    includeEnvironmentAsDefaults = true,
) => {
    options = includeEnvironmentAsDefaults
        ? {
              clientUrl: process.env.MONGODB_URL,
              dbName: process.env.MONGODB_DB_NAME,
              ...options,
          }
        : { ...options };

    const orm = await MikroORM.init<MongoDriver>({
        ...options,
        entities,
        type: 'mongo',
    });

    return orm;
};
