import type { ClientEvents } from 'discord.js';

import type { Bot } from '../../bot';

export type EventHandler = keyof ClientEvents extends infer E
    ? E extends keyof ClientEvents
        ? {
              readonly name: string;
              readonly event: E;
              exec(bot: Bot, ...args: ClientEvents[E]): unknown;
          }
        : never
    : never;
