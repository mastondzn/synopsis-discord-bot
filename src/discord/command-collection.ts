import { Collection } from 'discord.js';

import type { BotCommand } from '../utils/types';
import * as objectOfCommands from './commands';

export const commands: Collection<string, BotCommand> = new Collection();

type Key = keyof typeof objectOfCommands;

let key: Key;
for (key in objectOfCommands) {
    commands.set(objectOfCommands[key].data.name, objectOfCommands[key]);
}
