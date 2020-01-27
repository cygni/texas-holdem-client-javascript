import { createDeck, evaluator, createBot, events, getNameFromCommandLine } from './client/index.mjs';
import { isSameHand } from './client/index.mjs';

// Create the bot, name it by using the command line argument (yarn play:<env>:<room> player-name)
const bot = createBot({ name: getNameFromCommandLine() });

// From here on you can do your magic!
// All events are described in the README
// bot.on(events.PlayIsStartedEvent, (event) => {
//     console.log(`${bot.getGameState().getMyPlayerName()} got a PlayIsStartedEvent, tableId: ${bot.getGameState().getTableId()}`);
//     console.log('I got chips:', bot.getGameState().getMyChips());
//     console.log('My player: ', event);
// });

bot.on(events.TableIsDoneEvent, (event) => {
    console.log(`Table is done [amIWinner=${bot.getGameState().amIWinner()}]`);
    console.log('Table is done event ', event);
});

const drawAllCommunityCards = ({ deck, communityCards }) => {
    const communityCardsLeft = 5 - communityCards.length;
    const allCommunityCards = [...communityCards];
    for (let i = 0; i < communityCardsLeft; i++) {
        allCommunityCards.push(deck.draw(1));
    }
    return allCommunityCards;
};

const drawAllOtherHands = ({ deck, allCommunityCards, externalPlayerCount }) => Array.from(
    { length: externalPlayerCount },
    () => {
        const hand = [...allCommunityCards];
        hand.push(deck.draw(1));
        hand.push(deck.draw(1));
        return hand;
    }
);

const simulateOneGame = ({ communityCards, myCards, playerCount }) => {
    const deck = createDeck([...communityCards, ...myCards]);
    const allCommunityCards = drawAllCommunityCards({ deck, communityCards });
    const otherHands = drawAllOtherHands({ deck, allCommunityCards, externalPlayerCount: playerCount - 1 });
    const myHand = [...allCommunityCards, ...myCards];

    const winners = evaluator.winners([myHand, ...otherHands]);
    const amIWinner = winners.filter(hand => isSameHand(hand, myHand)).length > 0;

    return amIWinner;
};

const simulateGames = ({ communityCards, myCards, playerCount }) => {
    const simulations = 1000;

    let wins = 0;
    for (let i = 0; i < simulations; i++) {
        const amIWinner = simulateOneGame({ communityCards, myCards, playerCount });
        if (amIWinner) {
            wins = wins + 1;
        }
    }

    return wins > 0 ? (wins / simulations) : 0;
};



// Register the action handler, this method is invoked by the game engine when it is 
// time for your bot to make a move.
// eslint-disable-next-line complexity
bot.registerActionHandler(({ raiseAction, callAction, checkAction, foldAction, allInAction }) => {
    const myCards = bot.getGameState().getMyCards();
    const communityCards = bot.getGameState().getCommunityCards();
    const playerCount = bot.getGameState().getTablePlayers().filter(player => !player.folded).length;
    const chance = simulateGames({ communityCards, myCards, playerCount });
    console.log('In action: ',  { chance, count: communityCards.length, playerCount, myChips: bot.getGameState().getMyChips() });

    const handleBigTablePlay = () => {
        const selectHighLevelAction = () => allInAction;
        if (chance > 0.7) {
            console.log('High level: ', bot.getGameState().getMyCardsAndCommunityCards());
            return selectHighLevelAction();
        }
    
        const selectMidLevelAction = () => raiseAction || callAction || checkAction || allInAction || foldAction;
        if (chance > 0.50) {
            // console.log('Mid level: ', bot.getGameState().getMyCardsAndCommunityCards());
            return selectMidLevelAction();
        }
    
        const selectMidLowerLevelAction = () => checkAction || callAction || foldAction;
        if (chance >= 0) {
            return selectMidLowerLevelAction();
        }
    
        const selectLowLevelAction = () => callAction || checkAction || foldAction;
        return selectLowLevelAction();    
    };

    if (playerCount > 2) {
        return handleBigTablePlay();
    }


    const handleSmallTablePlay = () => {
        const selectHighLevelAction = () => allInAction;
        if (chance > 0.65) {
            console.log('High level: ', bot.getGameState().getMyCardsAndCommunityCards());
            return selectHighLevelAction();
        }
    
        const selectMidLevelAction = () => raiseAction || callAction || checkAction || allInAction || foldAction;
        if (chance > 0.40) {
            // console.log('Mid level: ', bot.getGameState().getMyCardsAndCommunityCards());
            return selectMidLevelAction();
        }
    
        const selectMidLowerLevelAction = () => checkAction || callAction || foldAction;
        if (chance >= 0) {
            return selectMidLowerLevelAction();
        }
    
        const selectLowLevelAction = () => callAction || checkAction || foldAction;
        return selectLowLevelAction();    
    };

    return handleSmallTablePlay();

    
});

bot.connect();

