import type { Configuration, Options } from '@mikro-orm/core';
import type { MongoDriver } from '@mikro-orm/mongodb';
import type { ApplicationCommandOptionType } from 'discord.js';

export type MikroWithMongoDriverOptions =
    | Options<MongoDriver>
    | Configuration<MongoDriver>;

export interface UserArgumentInput {
    name: string;
    type: ApplicationCommandOptionType;
    value: string | number | boolean | null;
}
