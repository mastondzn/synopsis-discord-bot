import { MikroORM } from '@mikro-orm/core';
import type { MongoDriver } from '@mikro-orm/mongodb';

import type { MikroWithMongoDriverOptions } from '../utils/types';
import * as objectOfEntities from './entitites';

type Key = keyof typeof objectOfEntities;
type Entity = typeof objectOfEntities[Key];

const entities: Entity[] = [];

let key: Key;
for (key in objectOfEntities) {
    entities.push(objectOfEntities[key]);
}

const createURL = (username: string, password: string) => {
    return `mongodb://${username}:${password}@localhost:27017/?authMechanism=DEFAULT&authSource=admin`;
};

export const makeMikroORM = (
    options?: Omit<MikroWithMongoDriverOptions, 'entities'>,
    useDefaults = true,
) => {
    options = useDefaults
        ? {
              clientUrl: createURL(
                  process.env.MONGO_USERNAME,
                  process.env.MONGO_PASSWORD,
              ),
              dbName: 'synopsisdiscordbot',
              ...options,
          }
        : { ...options };

    return MikroORM.init<MongoDriver>({
        ...options,
        entities,
        type: 'mongo',
    });
};
