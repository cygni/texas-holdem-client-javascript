// This is the home of your bot.
import { createBot, events, getNameFromCommandLine, evaluator } from '@cygni/poker-client-api';

// Create the bot, name it by using the command line argument (yarn play:<env>:<room> player-name)
const bot = createBot({ name: getNameFromCommandLine() });

// From here on you can do your magic!

// Register the action handler, this method is invoked by the game engine when it is
// time for your bot to make a move.
bot.registerActionHandler(({ raiseAction, callAction, checkAction, foldAction, allInAction }) => {
    // Do magic, and return your action.
    // Note that some of the actions may be unset.
    // Example, if a check is not possible, the checkAction is undefined
    // Each action contains the name of the action (actionType) and the amount required.
    console.log('ActionHandler: ', { raiseAction, callAction, checkAction, foldAction, allInAction });

    // Evaluate a hand. The game state contains a bunch of utility functions that you
    // can query to get info about the game.
    const gameState = bot.getGameState();
    const evaluatedHand = evaluator.evaluate(gameState.getMyCardsAndCommunityCards());

    // Get the ranking of your hand. The ranking for two pair is e.g. lower than the ranking for three of a kind.
    const handRanking = evaluatedHand.ranking();
    const myCardsInfo = gameState.getMyCardsAndCommunityCards().map((card) => ` ${card.rank} of ${card.suit}`);

    console.log(`My cards:${myCardsInfo}`);
    console.log(`My hand: ${evaluatedHand.name()}, handRanking: ${handRanking}`);

    raiseAction.amount = 100000;
    // This bot is very aggressive - it always tries to raise, or go all in
    return raiseAction || allInAction || callAction || checkAction || foldAction;
});

// All events are described in the README
// Usually, events are simply used to save your own state or for logging purposes
bot.on(events.PlayIsStartedEvent, (event) => {
    console.log(
        `${bot.getGameState().getMyPlayerName()} got a PlayIsStartedEvent, tableId: ${bot.getGameState().getTableId()}`
    );
    if (bot.getGameState().amIStillInGame()) {
        console.log('I got chips:', bot.getGameState().getMyChips());
    }
    console.log('Player count:', event.players.length);
});

bot.on(events.ShowDownEvent, (event) => {
    // A remapping of the showdown event to make it more
    // console log friendly
    const showDown = event.playersShowDown.map((playerShowDown) => {
        return {
            player: `${playerShowDown.player.name} (${playerShowDown.player.chipCount})`,
            hand: playerShowDown.hand.pokerHand,
            cards: playerShowDown.hand.folded
                ? ''
                : playerShowDown.hand.cards.reduce(
                      (accumulator, card) => `${accumulator}${card.rank} of ${card.suit}, `,
                      ''
                  ),
            won: playerShowDown.wonAmount,
            folded: playerShowDown.hand.folded,
        };
    });

    console.log('\n\n*****\nShowDown:', showDown);
});

bot.on(events.TableIsDoneEvent, (event) => {
    console.log(`Table is done [amIWinner=${bot.getGameState().amIWinner()}]`);
    console.log('Table is done event ', event.players);
});

// Finally, connect the bot to the server
bot.connect();
