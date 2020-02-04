// This is the home of your bot.

import { createBot, events, getNameFromCommandLine } from '@cygni/poker-client-api';

// Create the bot, name it by using the command line argument (yarn play:<env>:<room> player-name)
const bot = createBot({ name: getNameFromCommandLine() });

// From here on you can do your magic!
// All events are described in the README
bot.on(events.PlayIsStartedEvent, (event) => {
    console.log(`${bot.getGameState().getMyPlayerName()} got a PlayIsStartedEvent, tableId: ${bot.getGameState().getTableId()}`);
    if (bot.getGameState().amIStillInGame()) {
        console.log('I got chips:', bot.getGameState().getMyChips());
    }
    console.log('Player count:', event.players.length);
});

bot.on(events.TableIsDoneEvent, (event) => {
    console.log(`Table is done [amIWinner=${bot.getGameState().amIWinner()}]`);
    console.log('Table is done event ', event);
});

// Register the action handler, this method is invoked by the game engine when it is 
// time for your bot to make a move.
bot.registerActionHandler(({ raiseAction, callAction, checkAction, foldAction, allInAction }) => {
    // Do magic, and return your action. 
    // Note that some of the actions may be unset.
    // Example, if a check is not possible, the checkAction is undefined
    // Each action contains the name of the action (actionType) and the amount required.

    console.log(`ActionHandler: `, { raiseAction, callAction, checkAction, foldAction, allInAction });

    // This bot is very aggressive, goes all in every time possible (or raises, calls, checks, folds).
    return allInAction || raiseAction || callAction || checkAction || foldAction;
});

bot.connect();

