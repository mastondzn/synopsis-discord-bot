import type { ClientEvents } from 'discord.js';

import type { Synopsisbot } from '../../client';

export type EventHandler = keyof ClientEvents extends infer E
    ? E extends keyof ClientEvents
        ? {
              readonly name: string;
              readonly event: E;
              exec(bot: Synopsisbot, ...args: ClientEvents[E]): unknown;
          }
        : never
    : never;
