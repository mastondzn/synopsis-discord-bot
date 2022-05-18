import type { IntentsString } from 'discord.js';
import { Intents } from 'discord.js';

const { FLAGS: flags } = Intents;

export const intents: number[] = [];

let key: IntentsString;
for (key in flags) {
    if (key === 'DIRECT_MESSAGE_REACTIONS') continue;
    if (key === 'DIRECT_MESSAGE_TYPING') continue;
    if (key === 'GUILD_VOICE_STATES') continue;

    intents.push(flags[key]);
}
