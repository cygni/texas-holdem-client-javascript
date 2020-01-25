import { createBot } from './bot.mjs';
import { actions, events, rooms } from './protocol.mjs';
import { getNameFromCommandLine } from './name.mjs';

// The API of the client
export {
    createBot,
    actions,
    events,
    rooms,
    getNameFromCommandLine,
};
