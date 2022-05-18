import { Collection } from 'discord.js';

import type { EventHandler } from '../utils/types';
import * as objectOfEventHandlers from './events';

export const eventHandlers: Collection<string, EventHandler> = new Collection();

type Key = keyof typeof objectOfEventHandlers;

let key: Key;
for (key in objectOfEventHandlers) {
    eventHandlers.set(
        objectOfEventHandlers[key].name,
        objectOfEventHandlers[key],
    );
}
