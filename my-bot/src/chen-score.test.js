// eslint-disable-next-line no-undef
const esmImport = require('esm')(module);
const { calculateChenScore } = esmImport('./chen-score.mjs');
const { ranks, suits } = esmImport('@cygni/poker-client-api');


describe('Test chen score', () => {
    it('Should handle only preflop - 2 cards', () => {
        // No args should fail
        expect(() => calculateChenScore()).toThrow();

        // Way too short
        expect(() => calculateChenScore([])).toThrow();

        // Too short
        expect(() => calculateChenScore([{ rank: ranks.ace, suit: suits.hearts }])).toThrow();

        // Correct
        expect(() => calculateChenScore([
            { rank: ranks.ace, suit: suits.hearts },
            { rank: ranks.ace, suit: suits.diamonds },
        ])).not.toThrow();

        // Too many cards
        expect(() => calculateChenScore([
            { rank: ranks.ace, suit: suits.hearts },
            { rank: ranks.ace, suit: suits.diamonds },
            { rank: ranks.ace, suit: suits.clubs },
        ])).toThrow();

        // Illegal with same card
        expect(() => calculateChenScore([
            { rank: ranks.ace, suit: suits.hearts },
            { rank: ranks.ace, suit: suits.hearts },
        ])).toThrow();
    });

    // http://www.thepokerbank.com/strategy/basic/starting-hand-selection/chen-formula/
    it('Verify some hands', () => {
        // A = 8
        // Pair = multiply by 2.
        // Final score = 20 points.
        expect(calculateChenScore([
            { rank: ranks.ace, suit: suits.hearts },
            { rank: ranks.ace, suit: suits.diamonds }
        ])).toEqual(20);

        // K = 8
        // Pair = multiply by 2.
        // Final score = 16 points.
        expect(calculateChenScore([
            { rank: ranks.king, suit: suits.hearts },
            { rank: ranks.king, suit: suits.diamonds }
        ])).toEqual(16);

        // A = +10 points.
        // Suited = +2 points.
        // Final score = 12 points.
        expect(calculateChenScore([
            { rank: ranks.ace, suit: suits.spades },
            { rank: ranks.king, suit: suits.spades }
        ])).toEqual(12);

        // T = 10 x 1/2 = +5 points.
        // Pair = multiply by 2.
        // Final score = 10 points.
        expect(calculateChenScore([
            { rank: ranks.ten, suit: suits.spades },
            { rank: ranks.ten, suit: suits.diamonds }
        ])).toEqual(10);

        // 7 = 7 x 1/2 = +3.5 points.
        // Suited = +2 points.
        // 1 card gap = -1 point.
        // 0 - 1 card gap, both cards under Q = +1 point.
        // Final score = 6 points. (5.5 points rounded up)
        expect(calculateChenScore([
            { rank: ranks.five, suit: suits.diamonds },
            { rank: ranks.seven, suit: suits.diamonds }
        ])).toEqual(6);

        // 7 = 7 x 1/2 = +3.5 points.
        // 4+ card gap = -5 points.
        // Final score = -1 point. (-1.5 points rounded up)
        expect(calculateChenScore([
            { rank: ranks.deuce, suit: suits.spades },
            { rank: ranks.seven, suit: suits.diamonds }
        ])).toEqual(-1);
    });
});
