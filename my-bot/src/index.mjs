import { createBot, events, getNameFromCommandLine, evaluator } from '@cygni/poker-client-api';

import { calculateChenScore } from './chen-score.mjs';

// Create the bot, name it by using the command line argument (yarn play:<env>:<room> player-name)
const bot = createBot({ name: getNameFromCommandLine() });

// From here on you can do your magic!
// All events are described in the README
const localStatus = {
    roundCounter: {},
    isHeadsUp: false,
};

const calculateCurrentRound = () => {
    const tableId = `${bot.getGameState().getTableId()}`;
    const previous = localStatus.roundCounter[tableId];

    if (previous || previous === 0) {
        localStatus.roundCounter[tableId] = previous + 1;
    } else {
        localStatus.roundCounter[tableId] = 0;
    }

    return localStatus.roundCounter[tableId];
};

bot.on(events.PlayIsStartedEvent, (event) => {
    const round = calculateCurrentRound(event);
    console.log(`${bot.getGameState().getMyPlayerName()} got a PlayIsStartedEvent, tableId: ${bot.getGameState().getTableId()}, round=${round}`);
    console.log('I got chips:', bot.getGameState().getMyChips());
    console.log('My player: ', event);
    localStatus.isHeadsUp = event.players.length === 2;
});

bot.on(events.TableIsDoneEvent, (event) => {
    console.log(`Table is done [amIWinner=${bot.getGameState().amIWinner()}]`);
    console.log('Table is done event ', event);
});


bot.on(events.PlayerQuitEvent, (event) => {
    console.log('Player quit: ', event);
});

const goMad = ({ raiseAction, callAction, checkAction, foldAction, allInAction }) => allInAction || raiseAction || callAction || checkAction || foldAction;

// eslint-disable-next-line complexity
const raiseIfPossible = ({ followAllIn, raiseAction, callAction, checkAction, foldAction, allInAction }) => {
    let doFollow = followAllIn;
    if (allInAction && !followAllIn) {
        if (allInAction.amount === 0) {
            doFollow = true;
        }
    }
    return raiseAction || callAction || checkAction || (allInAction && doFollow) || foldAction;
};

const takeItSlow = ({ checkAction, foldAction, allInAction }) => checkAction || foldAction || allInAction;
const follow = ({ callAction, checkAction, foldAction, allInAction }) => checkAction || callAction || foldAction || allInAction;

// eslint-disable-next-line complexity
const foldBeforeTheFlop = ({ checkAction, callAction, foldAction, allInAction }) => {
    if (callAction && callAction.amount === 0) {
        return callAction || checkAction || foldAction || allInAction;
    }
    return checkAction || foldAction || allInAction;
};

const isPreFlop = () => bot.getGameState().getCommunityCards().length === 0;
const isPreTurn = () => bot.getGameState().getCommunityCards().length === 3;
const isPreRiver = () => bot.getGameState().getCommunityCards().length === 4;
// const isAllCards = () => bot.getGameState().getCommunityCards().length === 5;

const handlePreFlop = (actions) => {
    const myCards = bot.getGameState().getMyCards();
    const score = calculateChenScore(myCards);

    if (score > 15) {
        return raiseIfPossible({ followAllIn: true, ...actions });
    }

    if (score >= 9) {
        return raiseIfPossible(actions);
    }

    return foldBeforeTheFlop(actions);
};

const handlePreTurnBetterHand = ({ myRanking, ...possibleActions }) => {
    if (myRanking > 5) {
        return goMad(possibleActions);
    }

    if (myRanking > 4) {
        return raiseIfPossible({ followAllIn: true, ...possibleActions });
    }

    if (myRanking > 3) {
        return raiseIfPossible(possibleActions);
    }

    return follow(possibleActions);
};

const handlePreRiverBetterHand = ({ myRanking, ...possibleActions }) => {
    if (myRanking > 6) {
        return goMad(possibleActions);
    }

    if (myRanking > 5) {
        return raiseIfPossible({ followAllIn: true, ...possibleActions });
    }

    if (myRanking > 3) {
        return raiseIfPossible(possibleActions);
    }

    return follow(possibleActions);
};

const handleFullCardsBetterHand = ({ myRanking, ...possibleActions }) => {
    if (myRanking > 6) {
        return goMad(possibleActions);
    }

    if (myRanking > 5) {
        return raiseIfPossible({ followAllIn: true, ...possibleActions });
    }

    if (myRanking > 3) {
        return raiseIfPossible(possibleActions);
    }

    return follow(possibleActions);
};

const handleBetterHand = ({ myRanking, ...possibleActions }) => {
    if (isPreTurn()) {
        // After the flop
        console.log('After the flop');
        return handlePreTurnBetterHand({ myRanking, ...possibleActions });
    }

    if (isPreRiver()) {
        // After the turn
        console.log('After the turn');
        return handlePreRiverBetterHand({ myRanking, ...possibleActions });
    }

    // After the river
    console.log('After the river');
    return handleFullCardsBetterHand({ myRanking, ...possibleActions });
};

// Register the action handler, this method is invoked by the game engine when it is 
// time for your bot to make a move.
bot.registerActionHandler((possibleActions) => {
    if (isPreFlop()) {
        return handlePreFlop(possibleActions);
    }

    const myCards = bot.getGameState().getMyCards();
    const communityCards = bot.getGameState().getCommunityCards();

    const communityRanking = evaluator.evaluate(communityCards).ranking();
    const myRanking = evaluator.evaluate([...myCards, ...communityCards]).ranking();

    if (myRanking > communityRanking) {
        return handleBetterHand({ myRanking, ...possibleActions });
    }

    if (myRanking === communityRanking) {
        return follow(possibleActions);
    }

    return takeItSlow(possibleActions);
});

bot.connect();

