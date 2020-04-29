import { createBot } from './bot.js';
import { actions, events, rooms, ranks, suits, tableStates } from './protocol.js';
import { getNameFromCommandLine } from './name.js';
import { evaluator } from './poker-hand-evaluator.js';
import { createDeck, isSameSuit, isSameRank, isSameCard, isSameHand, isValidCard } from './deck.js';

// The API of the client
export {
    createBot,
    actions,
    events,
    rooms,
    getNameFromCommandLine,
    evaluator,
    ranks,
    suits,
    createDeck,
    isSameSuit, 
    isSameRank, 
    isSameCard, 
    isSameHand,
    isValidCard,
    tableStates,
};
