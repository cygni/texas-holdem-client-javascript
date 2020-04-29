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

// const handFromName = (name) => Object
//     .values(hands)
//     .find(hand => hand.name === name);

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
