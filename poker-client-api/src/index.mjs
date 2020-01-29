import { createBot } from './bot.mjs';
import { actions, events, rooms, ranks, suits } from './protocol.mjs';
import { getNameFromCommandLine } from './name.mjs';
import { evaluator } from './poker-hand-evaluator.mjs';
import { createDeck, isSameSuit, isSameRank, isSameCard, isSameHand, isValidCard } from './deck.mjs';

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
};
