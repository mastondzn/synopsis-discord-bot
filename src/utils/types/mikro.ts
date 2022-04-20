import type { Configuration, Options } from '@mikro-orm/core';
import type { MongoDriver } from '@mikro-orm/mongodb';

export type MikroWithMongoDriverOptions =
    | Options<MongoDriver>
    | Configuration<MongoDriver>;
