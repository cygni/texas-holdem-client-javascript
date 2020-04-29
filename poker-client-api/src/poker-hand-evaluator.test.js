// eslint-disable-next-line no-undef
const esmImport = require('esm')(module);
const { evaluator } = esmImport('./poker-hand-evaluator.mjs');
const { ranks, suits } = esmImport('./protocol.mjs');

const royalFlush = [
    { rank: ranks.ace, suit: suits.clubs },
    { rank: ranks.king, suit: suits.clubs },
    { rank: ranks.queen, suit: suits.clubs },
    { rank: ranks.jack, suit: suits.clubs },
    { rank: ranks.ten, suit: suits.clubs },
];

const straight = [
    { rank: ranks.ace, suit: suits.diamonds },
    { rank: ranks.king, suit: suits.clubs },
    { rank: ranks.queen, suit: suits.spades },
    { rank: ranks.jack, suit: suits.spades },
    { rank: ranks.ten, suit: suits.hearts },
];

const straight2 = [
    { rank: ranks.ace, suit: suits.spades },
    { rank: ranks.deuce, suit: suits.spades },
    { rank: ranks.five, suit: suits.hearts },
    { rank: ranks.four, suit: suits.spades },
    { rank: ranks.three, suit: suits.spades },
];

const straightFlush = [
    { rank: ranks.seven, suit: suits.hearts },
    { rank: ranks.six, suit: suits.hearts },
    { rank: ranks.five, suit: suits.hearts },
    { rank: ranks.four, suit: suits.hearts },
    { rank: ranks.three, suit: suits.hearts },
];

const straightFlush2 = [
    { rank: ranks.ace, suit: suits.spades },
    { rank: ranks.deuce, suit: suits.spades },
    { rank: ranks.five, suit: suits.spades },
    { rank: ranks.four, suit: suits.spades },
    { rank: ranks.three, suit: suits.spades },
];

const flush = [
    { rank: ranks.nine, suit: suits.clubs },
    { rank: ranks.six, suit: suits.clubs },
    { rank: ranks.five, suit: suits.clubs },
    { rank: ranks.four, suit: suits.clubs },
    { rank: ranks.three, suit: suits.clubs },
];

const fullHouse = [
    { rank: ranks.five, suit: suits.clubs },
    { rank: ranks.five, suit: suits.hearts },
    { rank: ranks.five, suit: suits.diamonds },
    { rank: ranks.three, suit: suits.clubs },
    { rank: ranks.three, suit: suits.hearts },
];

const fourOfAKind = [
    { rank: ranks.seven, suit: suits.clubs },
    { rank: ranks.three, suit: suits.hearts },
    { rank: ranks.three, suit: suits.diamonds },
    { rank: ranks.three, suit: suits.clubs },
    { rank: ranks.three, suit: suits.hearts },
];

const threeOfAKind = [
    { rank: ranks.ten, suit: suits.diamonds },
    { rank: ranks.ten, suit: suits.clubs },
    { rank: ranks.queen, suit: suits.spades },
    { rank: ranks.jack, suit: suits.spades },
    { rank: ranks.ten, suit: suits.hearts },
];

const twoPair = [
    { rank: ranks.queen, suit: suits.diamonds },
    { rank: ranks.king, suit: suits.clubs },
    { rank: ranks.queen, suit: suits.spades },
    { rank: ranks.jack, suit: suits.spades },
    { rank: ranks.jack, suit: suits.hearts },
];

const higherTwoPair = [
    { rank: ranks.king, suit: suits.diamonds },
    { rank: ranks.king, suit: suits.clubs },
    { rank: ranks.queen, suit: suits.spades },
    { rank: ranks.jack, suit: suits.spades },
    { rank: ranks.jack, suit: suits.hearts },
];

const pair = [
    { rank: ranks.deuce, suit: suits.diamonds },
    { rank: ranks.four, suit: suits.clubs },
    { rank: ranks.queen, suit: suits.spades },
    { rank: ranks.jack, suit: suits.spades },
    { rank: ranks.jack, suit: suits.hearts },
];

const higherPair = [
    { rank: ranks.deuce, suit: suits.diamonds },
    { rank: ranks.king, suit: suits.clubs },
    { rank: ranks.queen, suit: suits.spades },
    { rank: ranks.jack, suit: suits.spades },
    { rank: ranks.jack, suit: suits.hearts },
];

const fullPair = [
    { rank: ranks.deuce, suit: suits.diamonds },
    { rank: ranks.four, suit: suits.clubs },
    { rank: ranks.five, suit: suits.clubs },
    { rank: ranks.nine, suit: suits.clubs },
    { rank: ranks.queen, suit: suits.spades },
    { rank: ranks.jack, suit: suits.spades },
    { rank: ranks.jack, suit: suits.hearts },
];

const highCard = [
    { rank: ranks.four, suit: suits.clubs },
    { rank: ranks.five, suit: suits.spades },
    { rank: ranks.king, suit: suits.diamonds },
    { rank: ranks.queen, suit: suits.hearts },
    { rank: ranks.nine, suit: suits.hearts },
    { rank: ranks.deuce, suit: suits.clubs },
    { rank: ranks.seven, suit: suits.spades },
];

describe('Test card hands', () => {
    it('Verify hand names', () => {
        expect(evaluator.evaluate(highCard).name()).toEqual(evaluator.hands.highCard.name);
        expect(evaluator.evaluate(pair).name()).toEqual(evaluator.hands.pair.name);
        expect(evaluator.evaluate(fullPair).name()).toEqual(evaluator.hands.pair.name);
        expect(evaluator.evaluate(twoPair).name()).toEqual(evaluator.hands.twoPair.name);
        expect(evaluator.evaluate(threeOfAKind).name()).toEqual(evaluator.hands.threeOfAKind.name);
        expect(evaluator.evaluate(straight).name()).toEqual(evaluator.hands.straight.name);
        expect(evaluator.evaluate(straight2).name()).toEqual(evaluator.hands.straight.name);
        expect(evaluator.evaluate(flush).name()).toEqual(evaluator.hands.flush.name);
        expect(evaluator.evaluate(fullHouse).name()).toEqual(evaluator.hands.fullHouse.name);
        expect(evaluator.evaluate(fourOfAKind).name()).toEqual(evaluator.hands.fourOfAKind.name);
        expect(evaluator.evaluate(straightFlush).name()).toEqual(evaluator.hands.straightFlush.name);
        expect(evaluator.evaluate(straightFlush2).name()).toEqual(evaluator.hands.straightFlush.name);
        expect(evaluator.evaluate(royalFlush).name()).toEqual(evaluator.hands.royalFlush.name);
    });

    it('Verify rankings', () => {
        const royalFlushRanking = evaluator.evaluate(royalFlush).ranking();
        const straightFlushRanking = evaluator.evaluate(straightFlush).ranking();
        const fourOfAKindRanking = evaluator.evaluate(fourOfAKind).ranking();
        const fullHouseRanking = evaluator.evaluate(fullHouse).ranking();
        const flushRanking = evaluator.evaluate(flush).ranking();
        const straightRanking = evaluator.evaluate(straight).ranking();
        const threeOfAKindRanking = evaluator.evaluate(threeOfAKind).ranking();
        const twoPairRanking = evaluator.evaluate(twoPair).ranking();
        const pairRanking = evaluator.evaluate(pair).ranking();
        const highCardRanking = evaluator.evaluate(highCard).ranking();

        expect(royalFlushRanking).toBeGreaterThan(straightFlushRanking);
        expect(straightFlushRanking).toBeGreaterThan(fourOfAKindRanking);
        expect(fourOfAKindRanking).toBeGreaterThan(fullHouseRanking);
        expect(fullHouseRanking).toBeGreaterThan(flushRanking);
        expect(flushRanking).toBeGreaterThan(straightRanking);
        expect(threeOfAKindRanking).toBeGreaterThan(twoPairRanking);
        expect(twoPairRanking).toBeGreaterThan(pairRanking);
        expect(pairRanking).toBeGreaterThan(highCardRanking);
    });

    it('Verify five cards in full hand', () => {
        const evaluatedFull = evaluator.evaluate(fullPair);
        expect(evaluatedFull.cards().length).toEqual(5);
    });

    it('Verify same ranking in equal pair hand', () => {
        const evaluated = evaluator.evaluate(pair);
        const evaluatedFull = evaluator.evaluate(fullPair);
        expect(evaluated.ranking()).toEqual(evaluatedFull.ranking());
    });

    it('Verify same ranking for different pair hands', () => {
        const evaluated = evaluator.evaluate(pair);
        const evaluatedHigher = evaluator.evaluate(higherPair);
        expect(evaluatedHigher.ranking()).toEqual(evaluated.ranking());
    });

    it('Verify comparator functions', () => {
        // Classic comparator-style
        expect(evaluator.compare(pair, higherPair)).toBe(1);
        expect(evaluator.compare(higherPair, pair)).toBe(-1);
        expect(evaluator.compare(pair, pair)).toBe(0);
        expect(evaluator.compare(flush, fullHouse)).toBe(1);
        expect(evaluator.compare(royalFlush, straightFlush)).toBe(-1);
    });

    it('Verify winners', () => {
        const r1 = evaluator.winners([pair, higherPair, twoPair]);
        expect(evaluator.evaluate(r1[0]).name()).toEqual(evaluator.hands.twoPair.name);

        const r2 = evaluator.winners([highCard, pair, higherPair]);
        expect(evaluator.evaluate(r2[0]).name()).toEqual(evaluator.hands.pair.name);

        expect(r2.length).toEqual(1);
    });

    it('Verify same ranking for two pair hand', () => {
        const evaluated = evaluator.evaluate(twoPair);
        const evaluatedHigher = evaluator.evaluate(higherTwoPair);
        expect(evaluatedHigher.ranking()).toEqual(evaluated.ranking());
    });

    it('Verify my own hand is better than community cards', () => {
        const myCards = [
            { rank: ranks.ace, suit: suits.diamonds },
            { rank: ranks.ace, suit: suits.spades },
        ];

        const communityCards = [
            { rank: ranks.queen, suit: suits.hearts },
            { rank: ranks.four, suit: suits.spades },
            { rank: ranks.five, suit: suits.clubs },
            { rank: ranks.jack, suit: suits.hearts },
        ];

        const myRanking = evaluator.evaluate([...myCards, ...communityCards]).ranking();
        const communityRanking = evaluator.evaluate(communityCards).ranking();
        expect(myRanking).toBeGreaterThan(communityRanking);


        const compare = evaluator.compare([...myCards, ...communityCards], communityCards);
        expect(compare).toBe(-1);
    });
});
