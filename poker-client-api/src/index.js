/**
 * This module contains the JavaScript API for the Texas hold'em Botgame by Cygni.
 * 
 * The API contains the following:
 * @see createBot A function used to actually create the bot-object. This object will then be used to register an action request handler where your code typically is implemented.
 * @see getNameFromCommandLine A utility for reading the name from the command line
 * @module @cygni/poker-client-api
 */
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
    evaluator,
    ranks,
    suits,
    tableStates,
    getNameFromCommandLine,
    createDeck,
    isSameSuit,
    isSameRank,
    isSameCard,
    isSameHand,
    isValidCard,
};
