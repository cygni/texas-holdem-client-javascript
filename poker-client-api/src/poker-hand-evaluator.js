// @ts-ignore
import solver from 'pokersolver';

import { toTexasCard, toSolverHand } from './pokersolver-converter.js';

const Hand = solver.Hand;

const hands = {
    highCard: { name: 'High Card', ranking: 1 },
    pair: { name: 'Pair', ranking: 2 },
    twoPair: { name: 'Two Pair', ranking: 3 },
    threeOfAKind: { name: 'Three of a Kind', ranking: 4 },
    straight: { name: 'Straight', ranking: 5 },
    flush: { name: 'Flush', ranking: 6 },
    fullHouse: { name: 'Full House', ranking: 7 },
    fourOfAKind: { name: 'Four of a Kind', ranking: 8 },
    straightFlush: { name: 'Straight Flush', ranking: 9 },
    royalFlush: { name: 'Royal Flush', ranking: 10 },
};

const isRoyalFlush = (solved) => solved.name === hands.straightFlush.name && solved.descr === hands.royalFlush.name;

const fromSolved = (solved) => {
    const evaluated = {
        name: () => {
            if (isRoyalFlush(solved)) {
                return hands.royalFlush.name;
            }
            return solved.name;
        },
        description: () => solved.descr,
        ranking: () => {
            if (isRoyalFlush(solved)) {
                return solved.rank + 1;
            }
            return solved.rank;
        },
        cards: () => solved.cards.map((solverCard) => toTexasCard(`${solverCard.value}${solverCard.suit}`)),
        asString: () => {
            const result = {
                cards: solved.cards.map((solverCard) => `${solverCard.value}${solverCard.suit}`).join(', '),
                name: evaluated.name(),
                ranking: evaluated.ranking(),
                description: evaluated.description(),
            };

            return JSON.stringify(result, null, 4);
        },
    };

    return evaluated;
};

const evaluate = (cards = []) => {
    const solved = Hand.solve(toSolverHand(cards));
    return fromSolved(solved);
};

const winners = (texasHands) => {
    const solvedHands = texasHands.map(toSolverHand).map((solverHand) => Hand.solve(solverHand));

    return Hand.winners(solvedHands)
        .map((solved) => fromSolved(solved))
        .map((evaluated) => evaluated.cards());
};

const compare = (texasHand1, texasHand2) => {
    const solved1 = Hand.solve(toSolverHand(texasHand1));
    const solved2 = Hand.solve(toSolverHand(texasHand2));

    return solved1.compare(solved2);
};

/**
 * The evaluator is used to analyze cards. The main function is named "evaluate" and can give you
 * a ranking for your cards.
 */
export const evaluator = {
    /**
     * An enum of available poker hands and their ranking.
     *
     * The highest hand is the Royal Flush with the ranking 10.
     * The lowest hand is the High Card with a ranking of 1.
     */
    hands,

    /**
     * Evaluates the provided hand to an 'evaluated hand' which simply can give you
     * the ranking, and the name of the hand.
     *
     * Example: const ranking = evaluator.evaluate(bot.getGameState().getMyCardsAndCommunityCards()).ranking();
     *
     * @param {Array} cards An array of cards, typically your cards, and the community cards.
     * @returns {Object} An evaluated hand containing the ranking, and the name of the hand.
     */
    evaluate,

    /**
     * From a set of hands, find the winners. Useful when comparing hands against each other.
     * @param {Array} texasHands An array of hands (and a hand is an array of cards).
     * @returns {Array} An array of the winning hands. Usually just one hand.
     */
    winners,

    /**
     * Compare two hands against each other. If the first hand is the winner then -1 is returned.
     * If the second hand is the winner, +1 is returned. Equal hands returns 0.
     *
     * @returns -1, 0 or +1
     */
    compare,
};
