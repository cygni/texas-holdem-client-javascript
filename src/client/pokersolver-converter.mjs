import { ranks, suits } from './protocol.mjs';

const solverSuits = {
    clubs: 'c',
    diamonds: 'd',
    spades: 's',
    hearts: 'h',
};

// For quick validation lookup
const solverSuitValues = Object.values(solverSuits);

const solverRanks = {
    deuce: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
    ten: 'T',
    jack: 'J',
    queen: 'Q',
    king: 'K',
    ace: 'A',
};

// For quick validation lookup
const solverRankValues = Object.values(solverRanks);

// Special case, not a real card, but the pokersolver-lib sometimes converts to this for aces
const rankOne = '1';
solverRankValues.push(rankOne);

const toSolverSuit = texasCard => {
    const s = Object.entries(suits).find(entry => texasCard.suit === entry[1]);

    if (s) {
        return solverSuits[s[0]];
    }
    throw new Error(`Invalid suit [suit=${texasCard.suit}]`);
};

const toSolverRank = texasCard => {
    const r = Object.entries(ranks).find(entry => texasCard.rank === entry[1]);

    if (r) {
        return solverRanks[r[0]];
    }
    throw new Error(`Invalid rank [rank=${texasCard.rank}]`);
};

const toSolverCard = (texasCard) => `${toSolverRank(texasCard)}${toSolverSuit(texasCard)}`;

const validateSolverRank = (solverRank) => {
    if (solverRankValues.includes(solverRank)) {
        return;
    }

    throw new Error(`Invalid solver rank [solverRank=${solverRank}]`);
};

const validateSolverSuit = (solverSuit) => {
    if (solverSuitValues.includes(solverSuit)) {
        return;
    }
    throw new Error(`Invalid solver suit [solverSuit=${solverSuit}]`);
};

const validateSolverCard = (solverCard) => {
    if (solverCard && solverCard.length === 2) {
        try {
            validateSolverRank(solverCard[0]);
            validateSolverSuit(solverCard[1]);
        } catch (err) {
            console.log('ERROR – solverCard: ', solverCard);
            throw err;
        }
        return;
    }
    throw new Error(`Invalid solver card [solverCard=${solverCard}]`);
};

const toTexasSuit = solverCard => {
    const s = Object.entries(solverSuits).find(entry => solverCard[1] === entry[1]);
    return suits[s[0]];
};

const toTexasRank = solverCard => {
    // Special case, not a real card, but the pokersolver-lib sometimes converts to this for aces
    if (solverCard[0] === rankOne) {
        return ranks.ace;
    }

    const r = Object.entries(solverRanks).find(entry => solverCard[0] === entry[1]);
    return ranks[r[0]];
};

const toTexasCard = solverCard => {
    validateSolverCard(solverCard);
    return { rank: toTexasRank(solverCard), suit: toTexasSuit(solverCard) };
};

const toSolverHand = texasHand => texasHand.map(toSolverCard);
const toTexasHand = solverHand => solverHand.map(toTexasCard);

export { toSolverCard, toTexasCard, toSolverHand, toTexasHand };
