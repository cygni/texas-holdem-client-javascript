import { toSolverCard, toTexasCard } from './pokersolver-converter.js';
import { ranks, suits } from './protocol.js';

describe('Testing conversion between Texas protocol and pokersolver hands', () => {
    it('Convert from texas protocol', () => {
        expect(toSolverCard({ rank: ranks.ace, suit: suits.diamonds })).toEqual('Ad');
        expect(toSolverCard({ rank: ranks.king, suit: suits.hearts })).toEqual('Kh');
        expect(toSolverCard({ rank: ranks.queen, suit: suits.clubs })).toEqual('Qc');
        expect(toSolverCard({ rank: ranks.jack, suit: suits.spades })).toEqual('Js');
        expect(toSolverCard({ rank: ranks.ten, suit: suits.diamonds })).toEqual('Td');
        expect(toSolverCard({ rank: ranks.nine, suit: suits.hearts })).toEqual('9h');
        expect(toSolverCard({ rank: ranks.eight, suit: suits.clubs })).toEqual('8c');
        expect(toSolverCard({ rank: ranks.seven, suit: suits.spades })).toEqual('7s');
        expect(toSolverCard({ rank: ranks.six, suit: suits.diamonds })).toEqual('6d');
        expect(toSolverCard({ rank: ranks.five, suit: suits.hearts })).toEqual('5h');
        expect(toSolverCard({ rank: ranks.four, suit: suits.clubs })).toEqual('4c');
        expect(toSolverCard({ rank: ranks.three, suit: suits.spades })).toEqual('3s');
        expect(toSolverCard({ rank: ranks.deuce, suit: suits.diamonds })).toEqual('2d');
    });

    it('Invalid texas rank should fail', () => {
        expect(() => toSolverCard({ rank: 'INVALID', suit: suits.diamonds })).toThrow();
    });

    it('Invalid texas suit should fail', () => {
        expect(() => toSolverCard({ rank: ranks.ace, suit: 'INVALID' })).toThrow();
    });

    it('Convert from texas protocol', () => {
        expect(toTexasCard('1d')).toMatchObject({ rank: ranks.ace, suit: suits.diamonds });
        expect(toTexasCard('Ad')).toMatchObject({ rank: ranks.ace, suit: suits.diamonds });
        expect(toTexasCard('Kd')).toMatchObject({ rank: ranks.king, suit: suits.diamonds });
        expect(toTexasCard('Qd')).toMatchObject({ rank: ranks.queen, suit: suits.diamonds });
        expect(toTexasCard('Jd')).toMatchObject({ rank: ranks.jack, suit: suits.diamonds });
        expect(toTexasCard('Td')).toMatchObject({ rank: ranks.ten, suit: suits.diamonds });
        expect(toTexasCard('9d')).toMatchObject({ rank: ranks.nine, suit: suits.diamonds });
        expect(toTexasCard('8d')).toMatchObject({ rank: ranks.eight, suit: suits.diamonds });
        expect(toTexasCard('7d')).toMatchObject({ rank: ranks.seven, suit: suits.diamonds });
        expect(toTexasCard('6d')).toMatchObject({ rank: ranks.six, suit: suits.diamonds });
        expect(toTexasCard('5d')).toMatchObject({ rank: ranks.five, suit: suits.diamonds });
        expect(toTexasCard('4s')).toMatchObject({ rank: ranks.four, suit: suits.spades });
        expect(toTexasCard('3c')).toMatchObject({ rank: ranks.three, suit: suits.clubs });
        expect(toTexasCard('2h')).toMatchObject({ rank: ranks.deuce, suit: suits.hearts });
    });

    it('Invalid solver rank should fail', () => {
        expect(() => toTexasCard('Id')).toThrow();
    });

    it('Invalid solver suit should fail', () => {
        expect(() => toTexasCard('Aq')).toThrow();
    });
});
