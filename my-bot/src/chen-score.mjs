import { isSameCard, isSameSuit, isValidCard, ranks } from '@cygni/poker-client-api';

const assertNotSameCard = (myCards) => {
    if (isSameCard(myCards[0], myCards[1])) {
        throw new Error(`Not allowed to two of the same in your hand [${JSON.stringify(myCards)}]`);
    }
};

const assertValidCard = (card) => {
    if (isValidCard(card)) {
        return;
    }
    throw new Error(`Not a valid card [card=${JSON.stringify(card)}]`);
};

const assertArrayWithCorrectLength = (myCards) => {
    if (myCards && myCards.length && myCards.length === 2) {
        return;
    }
    throw new Error(`Only two cards allowed [length=${JSON.stringify(myCards || [])}]`);
};

const assertTwoCards = (myCards) => {
    assertArrayWithCorrectLength(myCards);
    assertValidCard(myCards[0]);
    assertValidCard(myCards[1]);
    assertNotSameCard(myCards);
};

// The chen score
const cardScore = {};
cardScore[ranks.ace] = 10;
cardScore[ranks.king] = 8;
cardScore[ranks.queen] = 7;
cardScore[ranks.jack] = 6;
cardScore[ranks.ten] = 5;
cardScore[ranks.nine] = 4.5;
cardScore[ranks.eight] = 4;
cardScore[ranks.seven] = 3.5;
cardScore[ranks.six] = 3;
cardScore[ranks.five] = 2.5;
cardScore[ranks.four] = 2;
cardScore[ranks.three] = 1.5;
cardScore[ranks.deuce] = 1;

const rankScore = {};
rankScore[ranks.ace] = 14;
rankScore[ranks.king] = 13;
rankScore[ranks.queen] = 12;
rankScore[ranks.jack] = 11;
rankScore[ranks.ten] = 10;
rankScore[ranks.nine] = 9;
rankScore[ranks.eight] = 8;
rankScore[ranks.seven] = 7;
rankScore[ranks.six] = 6;
rankScore[ranks.five] = 5;
rankScore[ranks.four] = 4;
rankScore[ranks.three] = 3;
rankScore[ranks.deuce] = 2;


const startWithMaxCard = (myCards) => {
    const cardScore0 = cardScore[myCards[0].rank];
    const cardScore1 = cardScore[myCards[1].rank];
    return Math.max(cardScore0, cardScore1);
};

const doubleIfPair = (currentScore, myCards) => {
    const cardScore0 = cardScore[myCards[0].rank];
    const cardScore1 = cardScore[myCards[1].rank];

    if (cardScore0 === cardScore1) {
        return Math.max(cardScore0 * 2, 5);
    }
    return currentScore;
};

const addTwoForSameSuit = (currentScore, myCards) => {
    if (isSameSuit(myCards[0], myCards[1])) {
        return currentScore + 2;
    }

    return currentScore;
};

// eslint-disable-next-line complexity
const subtractForGap = (currentScore, myCards) => {
    const rankScore0 = rankScore[myCards[0].rank];
    const rankScore1 = rankScore[myCards[1].rank];
    const gap = Math.abs(rankScore0 - rankScore1);

    switch (gap) {
    case 0:
    case 1:
        return currentScore;
    case 2:
        return currentScore - 1;
    case 3:
        return currentScore - 2;
    case 4:
        return currentScore - 4;
    default:
        return currentScore - 5;
    }
};

const addBonusPoint = (currentScore, myCards) => {
    const rankScore0 = rankScore[myCards[0].rank];
    const rankScore1 = rankScore[myCards[1].rank];
    const gap = Math.abs(rankScore0 - rankScore1);

    if (gap === 1 || gap === 2) {
        if (rankScore1 < rankScore[ranks.queen] && rankScore1 < rankScore[ranks.queen]) {
            return currentScore + 1;
        }
    }
    return currentScore;
};

export const calculateChenScore = (myCards) => {
    assertTwoCards(myCards);

    const initialScore = startWithMaxCard(myCards);
    const scoreAfterDouble = doubleIfPair(initialScore, myCards);
    const scoreAfterSameSuit = addTwoForSameSuit(scoreAfterDouble, myCards);
    const scoreAfterGapSubtraction = subtractForGap(scoreAfterSameSuit, myCards);
    const scoreAfterBonusPoint = addBonusPoint(scoreAfterGapSubtraction, myCards);

    // Round up halfs (7.5 => 8)
    return Math.ceil(scoreAfterBonusPoint);
};