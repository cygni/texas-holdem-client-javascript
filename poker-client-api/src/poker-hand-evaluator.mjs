import solver from 'pokersolver';

import { toTexasCard, toSolverHand } from './pokersolver-converter.mjs';

const Hand = solver.Hand;

const hands = {
    highCard: 'High Card',
    pair: 'Pair',
    twoPair: 'Two Pair',
    threeOfAKind: 'Three of a Kind',
    straight: 'Straight',
    flush: 'Flush',
    fullHouse: 'Full House',
    fourOfAKind: 'Four of a Kind',
    straightFlush: 'Straight Flush',
    royalFlush: 'Royal Flush',
};

const isRoyalFlush = (solved) => solved.name === hands.straightFlush && solved.descr === hands.royalFlush;

const fromSolved = solved => {
    const evaluated = {
        name: () => {
            if (isRoyalFlush(solved)) {
                return hands.royalFlush;
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
        cards: () => solved.cards.map(solverCard => toTexasCard(`${solverCard.value}${solverCard.suit}`)),
        asString: () => {
            const result = {
                cards: solved.cards.map(solverCard => `${solverCard.value}${solverCard.suit}`).join(', '),
                name: evaluated.name(),
                ranking: evaluated.ranking(),
                description: evaluated.description(),
            };

            return JSON.stringify(result, null, 4);
        }
    };

    return evaluated;
};

const evaluate = (cards = []) => {
    const solved = Hand.solve(toSolverHand(cards));
    return fromSolved(solved);
};

const winners = (texasHands) => {
    const solvedHands = texasHands
        .map(toSolverHand)
        .map(solverHand => Hand.solve(solverHand));

    return Hand.winners(solvedHands).map(solved => fromSolved(solved)).map(evaluated => evaluated.cards());
};

const compare = (texasHand1, texasHand2) => {
    const solved1 = Hand.solve(toSolverHand(texasHand1));
    const solved2 = Hand.solve(toSolverHand(texasHand2));

    return solved1.compare(solved2);
};

const evaluator = {
    hands, evaluate, winners, compare
};

export { evaluator };
