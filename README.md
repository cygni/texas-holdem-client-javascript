# Texas hold'em Botgame – JavaScript client
This repo contains the JavaScript client for the [Texas hold'em Botgame](https://github.com/cygni/texas-holdem-botgame). 

## Prerequisites
* [Docker](https://www.docker.com/)
* [git](https://git-scm.com/)

## Getting started
Start off by cloning the repo:

```bash
git clone https://github.com/cygni/texas-holdem-client-javascript
```

The poker server runs as a docker process. The clients communicates with the server via sockets on port 4711 and there is a web interface on port 8080.

Start the server via docker-compose:
```bash
docker-compose up poker-server
```

Now you can browse the admin interface on [http://localhost:8080](http://localhost:8080).

Next up, getting the client started. Open a new terminal and start the development shell by executing this:
```bash
docker-compose run --rm poker-shell
```

This starts a terminal where you can run the client. Start off by installing all libs:
```bash
yarn install
```

Then start the client against your local poker-server:
```bash
yarn play:local:training JohnnyPuma
```

The `JohnnyPuma`-part may look a bit odd but it is simply the name of the poker player.

So, there are three rooms – training, freeplay, and finally tournament. The training room is what you typically use when you develop your bot. Tournament is the room where you meet other bots in a real tournament. Freeplay is a room where you can practice against other bots in tournament-like style.

There are two servers configured for the client. The local version that is mentioned above and the online version that is hosted on [http://poker.cygni.se](http://poker.cygni.se).

The following start commands are available:
* `yarn play:local:training`
* `yarn play:local:freeplay`
* `yarn play:local:tournament`
* `yarn play:online:training`
* `yarn play:online:freeplay`
* `yarn play:online:tournament`

Note that the player name must be provided as an argument after the `yarn`-command.

## How does it work?
The client connects to the server (typically on port `4711`), then the server pushes events to the client notifying the client on what is happening at the table. The client can analyze the events and when it is your turn to play you should answer to an "action request". Your answer is simply which action to choose (e.g. raise or fold).

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
} from './client/index.mjs';
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
* your local server (named `poker-server`)
* port `4711`
* the `training` room

You may of course connect the bot to other servers and you typically specify this via the environment variables named `POKER_HOST`, `POKER_PORT` and `POKER_ROOM`. If you want to you can also provide the parameters directly to the `connect`-call.

```javascript
// Connect the bot to some other server
bot.connect({ host: 'some.server.com', port: 1234, room: rooms.training });
```

Here you can see the `rooms` enum that holds definitions for the three different rooms – `training`, `freeplay`, and `tournament`.

## Events
The events are specified in the client API under `events`. The following events are sent to the client.

* `PlayIsStartedEvent`: when the play has - well - started.
* `CommunityHasBeenDealtACardEvent`: 
* `PlayerBetBigBlindEvent`: 
* `PlayerBetSmallBlindEvent`: 
* `PlayerCalledEvent`: 
* `PlayerCheckedEvent`: 
* `PlayerFoldedEvent`: 
* `PlayerForcedFoldedEvent`: 
* `PlayerQuitEvent`: 
* `PlayerRaisedEvent`: 
* `PlayerWentAllInEvent`: 
* `ServerIsShuttingDownEvent`: 
* `ShowDownEvent`: 
* `TableChangedStateEvent`: 
* `TableIsDoneEvent`: 
* `YouHaveBeenDealtACardEvent`: 
* `YouWonAmountEvent`: 

You listen to the events by using the EventEmitter pattern like this:

```javascript
bot.on(events.PlayIsStartedEvent, (event) => {
    console.log('The game has started and this is the event: ', event);
});
```

## Actions
Ok, so it is not only about listening to events. Sometimes your player must make a move such as fold, raise etc. This is called an action handler and you register your handler like this:

```javascript
bot.registerActionHandler((possibleActions) => {
    // Do magic, and return your action. It can be one of the following:
    // 'RAISE', 'CALL', 'CHECK', 'FOLD', 'ALL_IN' and the are defined in the actions-enum
    return actions.check;
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
* `getPotTotal()`: get the pot total
* `getSmallBlindAmount()`: get the small blind amount
* `getBigBlindAmount()`: get the big blind amount
* `getMyChips()`: get my chip count

## Evaluation of poker hands
The client API contains a utility for evaluating poker hands. It can be imported as `evaluator` and works like this.

```javascript
import { evaluator } from './client/index.mjs';

// ...stuff...

// Evaluate a hand
const hand = evaluator.evaluate(bot.getGameState().getMyCardsAndCommunityCards());

// Get the ranking of your hand. The ranking for two pair is e.g. lower than the ranking for three of a kind.
const ranking = hand.ranking();

// The name of the hand, match this against the hands-enum
if (hand.name() === hands.royalFlush) {
    console.log('We have a royal flush');
}

// Compares two hands in comparator-style. The result is -1 if my hand is better, +1 if "someOtherHand" is better, and 0 if the hands are equally good.
const value = evaluator.compare(
    bot.getGameState().getMyCardsAndCommunityCards(),
    someOtherHand
);


// Another approach is to use the winners-function. Compare hands and get the winning hands as an array.
const w = evaluator.winners([hand1, hand2, hand3]);
```

So, how do you create a hand? Well, you simply create an array with cards, and a card has a rank and a suit.

```javascript

import { ranks, suits } from './client/index.mjs';

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
} from './client/index.mjs';

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
