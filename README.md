# Texas hold'em Botgame – JavaScript client
This repo contains the JavaScript client for the [Texas hold'em Botgame](https://github.com/cygni/texas-holdem-botgame).

# About Texas hold'em
You can read the rules of the game at [pokernews.com](https://www.pokernews.com/poker-rules/texas-holdem.htm).
Check out the ranking of different [poker hands](pokerhands.md).

## Prerequisites
* [Docker](https://hub.docker.com/?overlay=onboarding): Note that in order to install Docker for Windows or MacOS you need to create/have an account at dockerhub. It's free and quick to setup.
* [git](https://git-scm.com/): On Mac this is typically done via Homebrew or the Mac OS X installer. For both, you need XCode Command Line Tools (`xcode-select --install`)


## Getting started
Start off by cloning the repo:

```bash
git clone https://github.com/cygni/texas-holdem-client-javascript
```

There are two processes, first off the poker server and then the poker client i.e. your bot. The latest stable poker server can be found online on [http://poker.cygni.se](http://poker.cygni.se). However, during development of your bot you typically run the server locally.

The local poker server runs as a docker process. The clients communicates with the server via sockets on port 4711 and there is a web interface on port 80 (and it is mapped to localhost on port 8080).

Start the local server via docker-compose:
```bash
docker-compose up poker-server
```

Now you can browse the admin interface on [http://localhost:8080](http://localhost:8080).

Next up, getting the client started. Open a new terminal and start the development shell by executing this:
```bash
docker-compose run --rm poker-shell
```

This starts a terminal where the project root folder is mapped as a volume. In this shell you have all the tools needed to run the client. Start off by installing all libs:

```bash
yarn install
```

Then start the client against your local poker server:
```bash
yarn play:local:training JohnnyPuma
```

The `JohnnyPuma`-part may look a bit odd but it is simply the name of the poker player.

The code for your bot is placed in the folder named `my-bot`.

So, there are three rooms – `training`, `freeplay`, and finally the `tournament` room. The `training` room is where you typically play when you develop your bot. The `tournament` is the where you meet other bots in a real tournament. In the `freeplay` room you can practice against other bots in a tournament-like style.

There are two servers configured for the client. The local version that is mentioned above and the online version that is hosted on [http://poker.cygni.se](http://poker.cygni.se).

The following start commands are available:
* `yarn play:local:training`: connects to the `training` room on your [local poker server](http://localhost:8080)
* `yarn play:local:freeplay`: connects to the `freeplay` room on your [local poker server](http://localhost:8080)
* `yarn play:local:tournament`: connects to the `tournament` room on your [local poker server](http://localhost:8080)
* `yarn play:online:training`: connects to the `training` room on the online poker server @ [poker.cygni.se](http://poker.cygni.se)
* `yarn play:online:freeplay`: connects to the `freeplay` room on the online poker server @ [poker.cygni.se](http://poker.cygni.se)
* `yarn play:online:tournament`: connects to the `tournament` room on the online poker server @ [poker.cygni.se](http://poker.cygni.se)

Note that the player name must be provided as an argument after the `yarn`-command.

## How does it work?
The client connects to the server (typically on port `4711`), then the server pushes events to the client notifying the client on what is happening at the table. The client can analyze the events and when it is your turn to play you should answer to an "action request". Your answer is simply which action to choose (e.g. `raise` or `fold`).

The client API contains the following:

```javascript
import { 
    // Utility for reading from the command line
    getNameFromCommandLine, 

    // Creates the bot
    createBot, 

    // Hand evaluator
    evaluator,

    // Enums
    rooms,
    events, 
    actions, 
    suits,
    ranks,

    // Deck functions
    createDeck,
    isSameSuit, 
    isSameRank, 
    isSameCard, 
    isSameHand,

    // State of the table, pre flop, flopo, turn, river
    tableStates,
} from '@cygni/poker-client-api';
```

## getNameFromCommandLine
This is simply a convenience method that reads an argument from the command line and uses that argument as the name for your player.

## Creating the bot
To create a bot simply invoke the `createBot`-function with the name of your player and connect it to the server. 

```javascript
// Create the bot
const bot = createBot({ name: getNameFromCommandLine() });

// ... implement bot logic

// Connect the bot to the server
bot.connect();
```

The `connect`-call defaults to
* your local server (named `poker-server` in `docker-compose.yml`)
* port `4711`
* the `training` room

You may of course connect the bot to other servers and you typically specify this via the environment variables named `POKER_HOST`, `POKER_PORT` and `POKER_ROOM`. If you want to you can also provide the parameters directly to the `connect`-call.

```javascript
// Connect the bot to some other server
bot.connect({ host: 'some.server.com', port: 1234, room: rooms.training });
```

Here you can see the `rooms` enum that holds definitions for the three different rooms – `training`, `freeplay`, and `tournament`.

## Events
The events are specified in the client API under `events`. The documentation for events and responses are in [events.md](events.md)

You listen to the events by using the `EventEmitter` pattern like this:

```javascript
bot.on(events.PlayIsStartedEvent, (event) => {
    console.log('The game has started and this is the event: ', event);
});
```

## Actions
Ok, so it is not only about listening to events. Sometimes your player must make a move such as `fold`, `raise` etc. This is called an action handler and you register your handler like this:

```javascript
bot.registerActionHandler(({ raiseAction, callAction, checkAction, foldAction, allInAction }) => {
    // Do magic, and return your action. 
    // Note that some of the actions may be unset.
    // Example, if a check is not possible, the checkAction is undefined
    // Each action contains the name of the action (actionType) and the amount required.

    // This bot goes all in every time possible (or folds when the player can't go all in).
    return allInAction || foldAction;
});
```

All actions are defined in the client API under `actions`. 

## Game state
You can use a convenience object that holds the state of the game. You access it by `bot.getGameState()`.

```javascript
bot.on(events.PlayIsStartedEvent, (event) => {
    console.log(`My chip count: ${bot.getGameState().getMyChips()}`);
});
```

The game state object contains the following methods:

* `getMyPlayerName()`: get the name of my player
* `getTablePlayer(name)`: gets a player by its name,
* `getTablePlayers()`: gets all table players
* `getMyPlayer()`: get my own player
* `hasPlayerFolded(name)`: checks if a named player has folded
* `hasPlayerGoneAllIn(name)`: checks if a named player has gone all in
* `getInvestmentInPotFor(name)`: gets the pot for a named player (not the chipcount
* `amIStillInGame()`: true if my player is still in the game (i.e. still has chips to play for)
* `amIWinner()`: true if my player is the winner
* `amIDealerPlayer()`: true if my player is the dealer
* `amISmallBlindPlayer()`: true if my player has the small blind
* `amIBigBlindPlayer()`: true if my player has the big blind
* `haveIFolded()`: true if I have folded
* `haveIGoneAllIn()`: true if I have gone all in
* `getMyInvestmentInPot()`: get my current investment in the pot
* `getMyCards()`: get my current cards
* `getCommunityCards()`: get the community cards
* `getMyCardsAndCommunityCards()`: get my cards AND the community cards
* `getTableId()`: get the table id
* `getTableState()`: get the current status of the table (PRE_FLOP, FLOP, TURN, RIVER, SHOWDOWN)
* `getPotTotal()`: get the pot total
* `getSmallBlindAmount()`: get the small blind amount
* `getBigBlindAmount()`: get the big blind amount
* `getMyChips()`: get my chip count


In order to e.g. get the current table status the following code can be used:

```javascript
import { 
    // State of the table, pre flop, flopo, turn, river
    tableStates,
} from '@cygni/poker-client-api';

// Setup bot...

const status = bot.getGameState().getTableState();

if (status === tableStates.flop) {
    // do flop stuff
}
```

The table statuses are:

* `preflop`: when you have been dealt your two cards
* `flop`: after the flop, but before the turn
* `turn`: after the turn, but before the river
* `river`: after the river, but before the showdown
* `showdown`: the showdown is a situation when, if more than one player remains after the last betting round, remaining players expose and compare their hands to determine the winner or winners

## Evaluation of poker hands
The client API contains a utility for evaluating poker hands. It can be imported as `evaluator` and works like this.

```javascript
import { evaluator } from '@cygni/poker-client-api';

// ...stuff...

// Evaluate a hand
const gameState = bot.getGameState();
const hand = evaluator.evaluate(gameState.getMyCardsAndCommunityCards());

// Get the ranking of your hand. The ranking for two pair is e.g. lower than the ranking for three of a kind.
const ranking = hand.ranking();

// The name of the hand, match this against the hands-enum
if (hand.name() === hands.royalFlush) {
    console.log('We have a royal flush');
}

// Compares two hands in comparator-style. The result is -1 if my hand is better,
// +1 if "someOtherHand" is better, and 0 if the hands are equally good.
const value = evaluator.compare(
    gameState.getMyCardsAndCommunityCards(),
    someOtherHand
);

// Another approach is to use the winners-function. Compare hands and get the winning hands as an array.
const w = evaluator.winners([hand1, hand2, hand3]);
```

The rankning of hands is as follows:
* `Royal flush`: 10
* `Straight flush`: 9
* `Four of a kind`: 8
* `Full House`: 7
* `Flush`: 6
* `Straight`: 5
* `Three of a kind`: 4
* `Two pair`: 3
* `Pair`: 2
* `High card`: 1

So, how do you create a hand? Well, you simply create an array with cards, and a card has a rank and a suit.

```javascript
import { ranks, suits } from '@cygni/poker-client-api';

const hand = [
    { rank: ranks.deuce, suit: suits.clubs },
    { rank: ranks.three, suit: suits.clubs },
    { rank: ranks.four, suit: suits.clubs },
    { rank: ranks.five, suit: suits.clubs },
    { rank: ranks.six, suit: suits.clubs },
    { rank: ranks.jack, suit: suits.diamonds },
    { rank: ranks.queen, suit: suits.hearts },
    { rank: ranks.king, suit: suits.spades },
];
```

The ranks are:
* `deuce`
* `three`
* `four`
* `five`
* `six`
* `seven`
* `eight`
* `nine`
* `ten`
* `jack`
* `queen`
* `king`
* `ace`

The suits are:
* `clubs`
* `diamonds`
* `spades`
* `hearts`

There are also some utility functions where you can work with a deck of cards. The deck is based on the NPM package [card-deck](https://www.npmjs.com/package/card-deck).

```javascript
import {
    suits,
    ranks,
    createDeck,
    isSameSuit, 
    isSameRank, 
    isSameCard, 
    isSameHand,
} from '@cygni/poker-client-api';

// Create a deck but do NOT include the cards provided (typically your hand)
const deck = createDeck([
    { rank: ranks.deuce, suit: suits.hearts }
    { rank: ranks.three, suit: suits.hearts },
    { rank: ranks.ace, suit: suits.hearts },
]);

const moreCards1 = deck.draw(5);
const moreCards2 = deck.draw(5);

isSameHand(moreCards1, moreCards2); // false
```


## Inspiration
The following code can be used as inspiration on how to implement your bot. It uses the evaluator and the ranking function.

```javascript
bot.registerActionHandler(({ raiseAction, callAction, checkAction, foldAction, allInAction }) => {
    const ranking = evaluator.evaluate(bot.getGameState().getMyCardsAndCommunityCards()).ranking();
    
    // All in on good cards
    const selectHighRankingAction = () => allInAction;
    if (ranking > 5) {
        return selectHighRankingAction();
    }

    // Raise, call - if possible
    const selectMidRankingAction = () => raiseAction || callAction || checkAction || foldAction;
    if (ranking > 3) {
        return selectMidRankingAction();
    }

    // Try to check, call etc.
    const selectLowRankingAction = () => checkAction || callAction || raiseAction || allInAction || foldAction;
    return selectLowRankingAction();
});
```