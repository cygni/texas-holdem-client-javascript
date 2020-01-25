import { createBot, actions, events, getNameFromCommandLine, evaluator } from './client/index.mjs';

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
// eslint-disable-next-line complexity
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

    const ranking = evaluator.evaluate(bot.getGameState().getMyCardsAndCommunityCards()).ranking();

    if (ranking > 5) {
        return allInAction || raiseAction || callAction || checkAction || foldAction;
    }

    if (ranking > 3) {
        return raiseAction || callAction || checkAction || foldAction;
    }

    return checkAction || callAction || raiseAction || allInAction || foldAction;
});

bot.connect();

