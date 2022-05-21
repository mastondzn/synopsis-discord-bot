import { REST } from '@discordjs/rest';
import type { MikroORM } from '@mikro-orm/core';
import type { MongoDriver } from '@mikro-orm/mongodb';
import type { ClientEvents, Collection } from 'discord.js';
import { Client } from 'discord.js';
import type Redis from 'ioredis';
import isDocker from 'is-docker';
import type { Logger } from 'winston';

import { makeMikroORM } from './db/mikro';
import { makeRedisDB } from './db/redis';
import { commands } from './discord/command-collection';
import { eventHandlers } from './discord/event-handler-collection';
import { intents } from './discord/intents';
import {
    checkEnvironmentVariables,
    loadAndCheckEnvironmentVariables,
} from './utils/functions';
import { makeWinstonLogger } from './utils/logger/logger';
import type { BotCommand, EventHandler } from './utils/types';

export interface BotOptions {
    isInAScriptContext: boolean;
    forceAuth?: 'prod' | 'staging';
}

export class Bot {
    client: Client;
    logger: Logger;
    discordRest: REST;
    commands: Collection<string, BotCommand>;
    eventHandlers: Collection<string, EventHandler>;
    orm!: MikroORM<MongoDriver>;
    redis!: Redis;

    options: BotOptions;

    constructor(options?: Partial<BotOptions>) {
        const defaultOptions: BotOptions = {
            isInAScriptContext: false,
        };
        this.options = { ...defaultOptions, ...options };

        // add client with intents
        this.client = new Client({
            intents,
            presence: {
                activities: [
                    {
                        type: 'WATCHING',
                        name: 'you.',
                    },
                ],
            },
        });

        // create the logger
        const nameBase = options?.isInAScriptContext ? 'script' : 'bot';
        this.logger = makeWinstonLogger({ fileNameBase: nameBase });

        // add discord rest
        this.discordRest = new REST({ version: '10' });

        // add the commands to the class
        this.commands = commands;

        // add the events to the class
        this.eventHandlers = eventHandlers;
    }

    async initialize() {
        // todo: do async stuff
        // add env variables
        await (isDocker()
            ? checkEnvironmentVariables()
            : loadAndCheckEnvironmentVariables());

        let auth =
            process.env.NODE_ENV === 'production'
                ? process.env.DISCORD_BOT_AUTH
                : process.env.DISCORD_BOT_STAGING_AUTH;

        if (this.options.forceAuth === 'prod')
            auth = process.env.DISCORD_BOT_AUTH;
        else if (this.options.forceAuth === 'staging')
            auth = process.env.DISCORD_BOT_STAGING_AUTH;

        // add token to rest client
        this.discordRest.setToken(auth);

        const logger = this.logger;

        // add the orm
        this.orm = await makeMikroORM();
        logger.info(`Connected to DB. (${this.orm.config.getClientUrl(true)})`);

        // add redis
        this.redis = await makeRedisDB();
        logger.info(
            `Connected to Redis cache. (${this.redis.options.host ?? '?'}:${
                this.redis.options.port ?? '?'
            })`,
        );

        this.client.on('newListener', (event: string) => {
            logger.info(`Listener set on current instance (for ${event})`);
        });

        if (!this.options.isInAScriptContext) {
            for (const [, handler] of eventHandlers) {
                this.client.on(handler.event, (...args) => {
                    // jfc this is so dumb

                    type HandlerRunner = (
                        bot: Bot,
                        ...args: ClientEvents[keyof ClientEvents]
                    ) => unknown;

                    void (handler.exec as HandlerRunner)(this, ...args);
                });
            }
        }

        // login to discord
        await this.client.login(auth);
        const username = this.client.user?.username ?? '?';
        const discriminator = this.client.user?.discriminator ?? '?';
        const id = this.client.user?.id ?? '?';

        logger.info(
            `Connected to Discord as ${username}#${discriminator}(${id}).`,
        );
        logger.info(`Current guilds:`);
        for (const [, guild] of await this.client.guilds.fetch()) {
            logger.info(`${guild.name}(${guild.id})`);
        }
    }
}
