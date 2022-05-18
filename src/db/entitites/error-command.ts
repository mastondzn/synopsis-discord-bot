import { Entity, Property } from '@mikro-orm/core';
import { CommandInteraction } from 'discord.js';
import { formatWithOptions } from 'node:util';

import type { UserArgumentInput } from '../../utils/types';
import { BaseEntity } from './base-entity';

@Entity()
export class CommandError extends BaseEntity {
    @Property()
    userName: string;

    @Property()
    userDiscriminator: string;

    @Property()
    userId: string;

    @Property()
    channelId: string | null;

    @Property()
    guildId: string | null;

    @Property()
    guildName: string | null;

    @Property()
    args: UserArgumentInput[];

    @Property()
    errorMessage: string;

    @Property()
    stringifiedError: string;

    constructor(interaction: CommandInteraction, error: Error) {
        super();

        const { user, guild, channel, options } = interaction;

        this.userName = user.username;
        this.userDiscriminator = user.discriminator;
        this.userId = user.id;
        this.channelId = channel?.id ?? null;
        this.guildId = guild?.id ?? null;
        this.guildName = guild?.name ?? null;

        const argumentsUsed: UserArgumentInput[] = options.data.map(
            (element) => {
                return {
                    name: element.name,
                    type: element.type,
                    value: element.value ?? null,
                };
            },
        );

        this.args = argumentsUsed;

        this.errorMessage = error.message;

        let formatted: string;
        try {
            formatted =
                formatWithOptions(
                    {
                        colors: false,
                        depth: 4,
                    },
                    error,
                ) || 'Error in formatting string!';
        } catch {
            formatted = 'Error in formatting string!';
        }

        this.stringifiedError = formatted;
    }
}
