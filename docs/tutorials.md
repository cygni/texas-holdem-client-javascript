# Tutorials

Below you can find some shorter tutorials that shows various aspect of the bot programming.

* [Are my hidden cards a pair](#pair)
* [Are my hidden cards suited?](#suited)
* [Are my two hidden cards jacks or higher?](#jacksorhigher)
* [After the flop, is my full hand better than the community cards?](#betterhand)
* [Go all in if you have straight or better](#straightorbetter)

## Are my hidden cards a pair <span id="pair"></span>
This simple bot checks if your hidden cards are a pair (i.e. if they have the same rank). 
If it is a pair, the bot goes all in, otherwise it folds.

```javascript
import { createBot, getNameFromCommandLine, isSameRank } from '@cygni/poker-client-api';

const bot = createBot({ name: getNameFromCommandLine() });

bot.registerActionHandler(({ raiseAction, callAction, checkAction, foldAction, allInAction }) => {
    const gameState = bot.getGameState();
    const myCards = gameState.getMyCards();

    if (isSameRank(myCards[0], myCards[1])) {
        return allInAction;
    }

    return foldAction;
});

bot.connect();
```

## Are my hidden cards suited? <span id="suited"></span>
A bot that checks if your hidden cards are suited, and if your cards are suited in diamonds. If that is the case, go all in - otherwise fold.

```javascript
import { createBot, getNameFromCommandLine, isSameSuit, suits } from '@cygni/poker-client-api';

const bot = createBot({ name: getNameFromCommandLine() });

bot.registerActionHandler(({ raiseAction, callAction, checkAction, foldAction, allInAction }) => {
    const gameState = bot.getGameState();
    const myCards = gameState.getMyCards();

    if (isSameSuit(myCards[0], myCards[1])) {
        if (myCards[0].suit === suits.diamonds) {
            return allInAction;
        }
    }

    return foldAction;
});

bot.connect();
```

## Are my two hidden cards jacks or higher? <span id="jacksorhigher"></span>
A bot that checks if your hidden cards are jacks or higher. If so, go all in - otherwise fold.

```javascript
import { createBot, getNameFromCommandLine, ranks } from '@cygni/poker-client-api';

const bot = createBot({ name: getNameFromCommandLine() });

bot.registerActionHandler(({ foldAction, allInAction }) => {
    const gameState = bot.getGameState();
    const myCards = gameState.getMyCards();

    const jack = ranks.fromRankToNumber(ranks.jack);
    const first = ranks.fromRankToNumber(myCards[0].rank);
    const second = ranks.fromRankToNumber(myCards[1].rank);

    if ((first >= jack) && (second >= jack)) {
        return allInAction;
    }

    return foldAction;
});

bot.connect();
```

## After the flop, is my full hand better than the community cards? <span id="betterhand"></span>
A bot that checks if your hand is better than the community cards i.e. does your hidden cards help to get a better hand.

During the pre flop, play somewhat cautiosly.

```javascript
import { createBot, getNameFromCommandLine, evaluator, tableStates } from '@cygni/poker-client-api';

const bot = createBot({ name: getNameFromCommandLine() });

// During the pre flop, check, call or fold (in that order)
const handlePreFlop = ({ checkAction, callAction, foldAction }) => {
    return checkAction || callAction || foldAction;
};

// After the pre flop, raise or go all in when your combined hand ranks better than the community cards;
const handleEverythingAfterPreFlop = ({ raiseAction, foldAction, allInAction }) => {
    const gameState = bot.getGameState();
    const myCardsAndCommunityCards = gameState.getMyCardsAndCommunityCards();
    const communityCards = gameState.getCommunityCards();

    const myRanking = evaluator.evaluate(myCardsAndCommunityCards).ranking();
    const communityRanking = evaluator.evaluate(communityCards).ranking();

    if (myRanking > communityRanking) {
        return raiseAction || allInAction;
    }

    return foldAction;
};

bot.registerActionHandler(({ checkAction, callAction, raiseAction, foldAction, allInAction }) => {
    const gameState = bot.getGameState();

    if (gameState.getTableState() === tableStates.preflop) {
        return handlePreFlop({ checkAction, callAction, foldAction });
    }

    return handleEverythingAfterPreFlop({ raiseAction, foldAction, allInAction });
});

bot.connect();
```

## Go all in if you have straight or better <span id="straightorbetter"></span>
A bot that checks if your hand has straight or higher, and in that case goes all in.

During the pre flop, follow if you have two cards higher than tens.

```javascript
import { createBot, getNameFromCommandLine, evaluator, tableStates, ranks } from '@cygni/poker-client-api';

const bot = createBot({ name: getNameFromCommandLine() });

// During the pre flop - check/call when both cards are higher than 10
const handlePreFlop = ({ checkAction, callAction, foldAction }) => {
    const gameState = bot.getGameState();
    const myCards = gameState.getMyCards();

    const jack = ranks.fromRankToNumber(ranks.jack);
    const first = ranks.fromRankToNumber(myCards[0].rank);
    const second = ranks.fromRankToNumber(myCards[1].rank);

    if (first >= jack && second >= jack) {
        return checkAction || callAction || foldAction;
    }

    return foldAction;
};

// After the flop, go all in on straght or higher
const goAllInOnStraightOrHigher = ({ foldAction, allInAction }) => {
    const gameState = bot.getGameState();
    const myCardsAndCommunityCards = gameState.getMyCardsAndCommunityCards();
    const myRanking = evaluator.evaluate(myCardsAndCommunityCards).ranking();

    if (myRanking >= evaluator.hands.straight.ranking) {
        return allInAction;
    }

    return foldAction;
};

bot.registerActionHandler(({ checkAction, callAction, raiseAction, foldAction, allInAction }) => {
    const gameState = bot.getGameState();

    if (gameState.getTableState() === tableStates.preflop) {
        return handlePreFlop({ checkAction, callAction, foldAction });
    }

    return goAllInOnStraightOrHigher({ checkAction, callAction, raiseAction, foldAction, allInAction });
});

bot.connect();
```