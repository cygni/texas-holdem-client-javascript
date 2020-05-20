import Deck from 'card-deck';

import { suits, ranks } from './protocol.js';

const isString = (value) => typeof value == 'string';

const allCardsForSuit = (suit) =>
    Object.values(ranks)
        .filter((rank) => isString(rank))
        .map((rank) => ({ suit, rank }));
const allCards = () => Object.values(suits).map(allCardsForSuit).flat();

/**
 * Checks if two cards have the same suit.
 *
 * @param {Object} c1 The first card containing a suit attribute
 * @param {Object} c2 The second card containing a suit attribute
 */
export const isSameSuit = (c1, c2) => c1.suit === c2.suit;

/**
 * Checks if two cards have the same rank.
 *
 * @param {Object} c1 The first card containing a rank attribute
 * @param {Object} c2 The second card containing a rank attribute
 */
export const isSameRank = (c1, c2) => c1.rank === c2.rank;

/**
 * Checks if two cards are the same card meaning they have the same rank and the same suit.
 *
 * @param {Object} c1 The first card containing rank and suit
 * @param {Object} c2 The second card containing rank and suit
 */
export const isSameCard = (c1, c2) => isSameRank(c1, c2) && isSameSuit(c1, c2);

const rankValues = Object.values(ranks);
const suitValues = Object.values(suits);

/**
 * Checks if a card is valid i.e. has rank and suit, and has valid values for those.
 *
 * @param {Object} card The card to check
 * @returns true if the card is valid.
 */
export const isValidCard = (card) => rankValues.includes(card.rank) && suitValues.includes(card.suit);

/**
 * Creates a deck of cards where you can draw cards. Good for Monte Carlo simulations.
 *
 * The Deck is based on https://github.com/kadamwhite/node-card-deck#readme
 *
 * @param {Array} [cardsToSkip] An array of cards that should not be part of the deck (typically your cards)
 * @param {boolean} shuffle True if the deck should be shuffled (defaults to true)
 */
export const createDeck = (cardsToSkip, shuffle = true) => {
    const deck = new Deck(allCards());

    // Remove the cards from the deck, typically these cards are my cards and the community cards.
    if (cardsToSkip) {
        cardsToSkip.forEach((cardToSkip) => {
            deck.drawWhere((card) => isSameCard(card, cardToSkip), 1);
        });
    }

    if (shuffle) {
        deck.shuffle();
    }

    return deck;
};

const isPartOfHand = (hand, card) => hand.find((c) => isSameCard(c, card));

/**
 * Checks if two hands are identical.
 *
 * @param {Array} h1 an array of cards
 * @param {Array} h2 an array of cards
 */
export const isSameHand = (h1, h2) => {
    if (h1.length <= h2.length) {
        const filtered = h1.filter((card) => isPartOfHand(h2, card));
        return filtered.length === h1.length;
    }

    const filtered = h2.filter((card) => isPartOfHand(h2, card));
    return filtered.length === h2.length;
};
