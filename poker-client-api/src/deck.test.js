// eslint-disable-next-line no-undef
// const esmImport = require('esm')(module);
import { createDeck, isSameHand } from './deck.js';
import { suits, ranks } from './protocol.js';


describe('Test deck functions', () => {
    it('Verify that the skip cards are not present in deck', () => {
        const cardsToSkip = [
            { suit: suits.hearts, rank: ranks.ace },
            { suit: suits.diamonds, rank: ranks.ace },
            { suit: suits.clubs, rank: ranks.ace },
            { suit: suits.spades, rank: ranks.ace },
        ];

        const deck = createDeck(cardsToSkip);
        const remaining = deck.remaining();
        expect(remaining).toBe(52 - cardsToSkip.length);

        for(let i = 0; i < remaining; i++) {
            const card = deck.draw();    
            expect(card.rank).not.toBe(ranks.ace);
        }
        expect(deck.remaining()).toBe(0);
    });

    it('Verify full deck', () => {
        const deck = createDeck();
        expect(deck.remaining()).toBe(52);
    });

    it('Test compare functions', () => {
        const hand1 = [
            { suit: suits.hearts, rank: ranks.ace },
            { suit: suits.diamonds, rank: ranks.ace },
            { suit: suits.clubs, rank: ranks.ace },
            { suit: suits.spades, rank: ranks.ace },
        ];

        const hand2 = [
            { suit: suits.hearts, rank: ranks.ace },
            { suit: suits.diamonds, rank: ranks.ace },
            { suit: suits.clubs, rank: ranks.ace },
            { suit: suits.spades, rank: ranks.king },
        ];

        expect(isSameHand(hand1, hand1)).toBe(true);
        expect(isSameHand(hand1, hand2)).toBe(false);

        const deck = createDeck();
        const drawnHand1 = deck.draw(7);
        const drawnHand2 = deck.draw(7);
        expect(isSameHand(drawnHand1, drawnHand2)).toBe(false);
    });
});
