import { Entity, Property } from '@mikro-orm/core';
import { CommandInteraction } from 'discord.js';

import type { UserArgumentInput } from '../../utils/types';
import { CommandResult } from '../../utils/types';
import { BaseEntity } from './base-entity';

@Entity()
export class SuccessfulCommand extends BaseEntity {
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
    result: CommandResult;

    constructor(interaction: CommandInteraction, result: CommandResult) {
        super();

        const { user, guild, channelId, options } = interaction;

        this.userName = user.username;
        this.userDiscriminator = user.discriminator;
        this.userId = user.id;
        this.channelId = channelId ?? null;
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

        this.result = result;
    }
}
