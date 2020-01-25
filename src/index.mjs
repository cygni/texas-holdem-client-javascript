import { createBot, actions, events, getNameFromCommandLine } from './client/index.mjs';

// Create the bot, name it by using the command line argument (yarn play:<env>:<room> player-name)
const bot = createBot({ name: getNameFromCommandLine() });

// From here on you can do your magic!
// All events are described in the README
bot.on(events.PlayIsStartedEvent, (event) => {
    console.log(`${bot.getGameState().getMyPlayerName()} got a PlayIsStartedEvent, tableId: ${bot.getGameState().getTableId()}`);
    console.log('I got chips:', bot.getGameState().getMyChips());
    console.log('My player: ', event);
});

bot.on(events.TableIsDoneEvent, (event) => {
    console.log(`Table is done [amIWinner=${bot.getGameState().amIWinner()}]`);
    console.log('Table is done event ', event);
});

// Register the action handler, this method is invoked by the game engine when it is time for
// your bot to make a move
bot.registerActionHandler((possibleActions) => {
    let raiseAction, callAction, checkAction, foldAction, allInAction;

    possibleActions
        // eslint-disable-next-line complexity
        .forEach((action) => {
            switch (action.actionType) {
            case actions.raise:
                raiseAction = action;
                break;
            case actions.call:
                callAction = action;
                break;
            case actions.check:
                checkAction = action;
                break;
            case actions.fold:
                foldAction = action;
                break;
            case actions.allIn:
                allInAction = action;
                break;
            default:
                break;
            }
        });

    return checkAction || allInAction || callAction || raiseAction || foldAction;
});

bot.connect();

