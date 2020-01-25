// eslint-disable-next-line no-undef
const esmImport = require('esm')(module);
const { evaluator } = esmImport('./poker-hand-evaluator.mjs');

const royalFlush = [
    { 'rank': 'ACE', 'suit': 'CLUBS' },
    { 'rank': 'KING', 'suit': 'CLUBS' },
    { 'rank': 'QUEEN', 'suit': 'CLUBS' },
    { 'rank': 'JACK', 'suit': 'CLUBS' },
    { 'rank': 'TEN', 'suit': 'CLUBS' },
];

const straight = [
    { 'rank': 'ACE', 'suit': 'DIAMONDS' },
    { 'rank': 'KING', 'suit': 'CLUBS' },
    { 'rank': 'QUEEN', 'suit': 'SPADES' },
    { 'rank': 'JACK', 'suit': 'SPADES' },
    { 'rank': 'TEN', 'suit': 'HEARTS' },
];

const straight2 = [
    { 'rank': 'ACE', 'suit': 'SPADES' },
    { 'rank': 'DEUCE', 'suit': 'SPADES' },
    { 'rank': 'FIVE', 'suit': 'HEARTS' },
    { 'rank': 'FOUR', 'suit': 'SPADES' },
    { 'rank': 'THREE', 'suit': 'SPADES' },
];

const straightFlush = [
    { 'rank': 'SEVEN', 'suit': 'HEARTS' },
    { 'rank': 'SIX', 'suit': 'HEARTS' },
    { 'rank': 'FIVE', 'suit': 'HEARTS' },
    { 'rank': 'FOUR', 'suit': 'HEARTS' },
    { 'rank': 'THREE', 'suit': 'HEARTS' },
];

const straightFlush2 = [
    { 'rank': 'ACE', 'suit': 'SPADES' },
    { 'rank': 'DEUCE', 'suit': 'SPADES' },
    { 'rank': 'FIVE', 'suit': 'SPADES' },
    { 'rank': 'FOUR', 'suit': 'SPADES' },
    { 'rank': 'THREE', 'suit': 'SPADES' },
];

const flush = [
    { 'rank': 'NINE', 'suit': 'CLUBS' },
    { 'rank': 'SIX', 'suit': 'CLUBS' },
    { 'rank': 'FIVE', 'suit': 'CLUBS' },
    { 'rank': 'FOUR', 'suit': 'CLUBS' },
    { 'rank': 'THREE', 'suit': 'CLUBS' },
];

const fullHouse = [
    { 'rank': 'FIVE', 'suit': 'CLUBS' },
    { 'rank': 'FIVE', 'suit': 'HEARTS' },
    { 'rank': 'FIVE', 'suit': 'DIAMONDS' },
    { 'rank': 'THREE', 'suit': 'CLUBS' },
    { 'rank': 'THREE', 'suit': 'HEARTS' },
];

const fourOfAKind = [
    { 'rank': 'SEVEN', 'suit': 'CLUBS' },
    { 'rank': 'THREE', 'suit': 'HEARTS' },
    { 'rank': 'THREE', 'suit': 'DIAMONDS' },
    { 'rank': 'THREE', 'suit': 'CLUBS' },
    { 'rank': 'THREE', 'suit': 'HEARTS' },
];

const threeOfAKind = [
    { 'rank': 'TEN', 'suit': 'DIAMONDS' },
    { 'rank': 'TEN', 'suit': 'CLUBS' },
    { 'rank': 'QUEEN', 'suit': 'SPADES' },
    { 'rank': 'JACK', 'suit': 'SPADES' },
    { 'rank': 'TEN', 'suit': 'HEARTS' },
];

const twoPair = [
    { 'rank': 'QUEEN', 'suit': 'DIAMONDS' },
    { 'rank': 'KING', 'suit': 'CLUBS' },
    { 'rank': 'QUEEN', 'suit': 'SPADES' },
    { 'rank': 'JACK', 'suit': 'SPADES' },
    { 'rank': 'JACK', 'suit': 'HEARTS' },
];

const higherTwoPair = [
    { 'rank': 'KING', 'suit': 'DIAMONDS' },
    { 'rank': 'KING', 'suit': 'CLUBS' },
    { 'rank': 'QUEEN', 'suit': 'SPADES' },
    { 'rank': 'JACK', 'suit': 'SPADES' },
    { 'rank': 'JACK', 'suit': 'HEARTS' },
];

const pair = [
    { 'rank': 'DEUCE', 'suit': 'DIAMONDS' },
    { 'rank': 'FOUR', 'suit': 'CLUBS' },
    { 'rank': 'QUEEN', 'suit': 'SPADES' },
    { 'rank': 'JACK', 'suit': 'SPADES' },
    { 'rank': 'JACK', 'suit': 'HEARTS' },
];

const higherPair = [
    { 'rank': 'DEUCE', 'suit': 'DIAMONDS' },
    { 'rank': 'KING', 'suit': 'CLUBS' },
    { 'rank': 'QUEEN', 'suit': 'SPADES' },
    { 'rank': 'JACK', 'suit': 'SPADES' },
    { 'rank': 'JACK', 'suit': 'HEARTS' },
];

const fullPair = [
    { 'rank': 'DEUCE', 'suit': 'DIAMONDS' },
    { 'rank': 'FOUR', 'suit': 'CLUBS' },
    { 'rank': 'FIVE', 'suit': 'CLUBS' },
    { 'rank': 'NINE', 'suit': 'CLUBS' },
    { 'rank': 'QUEEN', 'suit': 'SPADES' },
    { 'rank': 'JACK', 'suit': 'SPADES' },
    { 'rank': 'JACK', 'suit': 'HEARTS' },
];

const highCard = [
    { 'rank': 'FOUR', 'suit': 'CLUBS' },
    { 'rank': 'FIVE', 'suit': 'SPADES' },
    { 'rank': 'KING', 'suit': 'DIAMONDS' },
    { 'rank': 'QUEEN', 'suit': 'HEARTS' },
    { 'rank': 'NINE', 'suit': 'HEARTS' },
    { 'rank': 'DEUCE', 'suit': 'CLUBS' },
    { 'rank': 'SEVEN', 'suit': 'SPADES' },
];

describe('Test card hands', () => {
    it('Verify hand names', () => {
        expect(evaluator.evaluate(highCard).name()).toEqual(evaluator.hands.highCard);
        expect(evaluator.evaluate(pair).name()).toEqual(evaluator.hands.pair);
        expect(evaluator.evaluate(fullPair).name()).toEqual(evaluator.hands.pair);
        expect(evaluator.evaluate(twoPair).name()).toEqual(evaluator.hands.twoPair);
        expect(evaluator.evaluate(threeOfAKind).name()).toEqual(evaluator.hands.threeOfAKind);
        expect(evaluator.evaluate(straight).name()).toEqual(evaluator.hands.straight);
        expect(evaluator.evaluate(straight2).name()).toEqual(evaluator.hands.straight);
        expect(evaluator.evaluate(flush).name()).toEqual(evaluator.hands.flush);
        expect(evaluator.evaluate(fullHouse).name()).toEqual(evaluator.hands.fullHouse);
        expect(evaluator.evaluate(fourOfAKind).name()).toEqual(evaluator.hands.fourOfAKind);
        expect(evaluator.evaluate(straightFlush).name()).toEqual(evaluator.hands.straightFlush);
        expect(evaluator.evaluate(straightFlush2).name()).toEqual(evaluator.hands.straightFlush);
        expect(evaluator.evaluate(royalFlush).name()).toEqual(evaluator.hands.royalFlush);
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
        expect(r1[0].name()).toEqual(evaluator.hands.twoPair);

        const r2 = evaluator.winners([highCard, pair, higherPair]);
        expect(r2[0].name()).toEqual(evaluator.hands.pair);
        expect(r2.length).toEqual(1);
        r2.forEach(h => console.log('CARDS: ', h.cards()));
    });

    it('Verify same ranking for two pair hand', () => {
        const evaluated = evaluator.evaluate(twoPair);
        const evaluatedHigher = evaluator.evaluate(higherTwoPair);
        expect(evaluatedHigher.ranking()).toEqual(evaluated.ranking());

        console.log('EVALUATED: ', evaluated.asString());
    });
});
