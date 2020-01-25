# texas-holdem-client-javascript

## Prerequisites
* Docker
* git

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
```
yarn play:local:training
```

## Events
The following events are sent to the client.

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

## Actions
Ok, so it is not only about listening to events. Sometimes your player must make a move such as fold, raise etc. This is called an action handler and you register your handler like this:

```javascript
bot.registerActionHandler((possibleActions) => {
    // Do magic, and return your action. It can be one of the following:
    // 'RAISE', 'CALL', 'CHECK', 'FOLD', 'ALL_IN' and the are defined in the actions-enum
    return actions.check;
});
```

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
The api contains a utility for evaluating poker hands.