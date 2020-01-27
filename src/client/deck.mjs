import Deck from 'card-deck';

import { suits, ranks } from './protocol.mjs';

const allCardsForSuit = suit => Object.values(ranks).map(rank => ({ suit, rank }));
const allCards = () => Object.values(suits).map(allCardsForSuit).flat();

export const isSameSuit = (c1, c2) => c1.suit === c2.suit;
export const isSameRank = (c1, c2) => c1.rank === c2.rank;
export const isSameCard = (c1, c2) => isSameRank(c1, c2) && isSameSuit(c1, c2);

export const createDeck = (cardsToSkip, shuffle = true) => {
    const deck = new Deck(allCards());

    // Remove the cards from the deck, typically these cards are my cards and the community cards.
    if (cardsToSkip) {
        cardsToSkip.forEach(cardToSkip => {
            deck.drawWhere(card => isSameCard(card, cardToSkip), 1);
        });
    }

    if (shuffle) {
        deck.shuffle();
    }

    return deck;
};

const isPartOfHand = (hand, card) => hand.find(c => isSameCard(c, card));

export const isSameHand = (h1, h2) => {
    if (h1.length <= h2.length) {
        const filtered = h1.filter(card => isPartOfHand(h2, card));
        return filtered.length === h1.length;
    }

    const filtered = h2.filter(card => isPartOfHand(h2, card));
    return filtered.length === h2.length;
};
