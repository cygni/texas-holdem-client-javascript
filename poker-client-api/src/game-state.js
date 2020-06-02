import emitters from 'events';
import { events } from './protocol.js';

const sortPlayersByChipCount = (players) => {
    return players
        .map((p) => p)
        .sort((left, right) => {
            if (left.chipCount < right.chipCount) {
                return -1;
            }
            if (left.chipCount > right.chipCount) {
                return 1;
            }
            return 0;
        });
};

export const setupGameState = ({ name }) => {
    const playerState = {
        isPlaying: false,
        isTableDone: false,
        tableId: 0,
        amount: 0,
        myCards: [],
        communityCards: [],
        potTotal: 0,
        winner: null,
        table: {
            state: '',
            players: [],
            smallBlindAmount: 0,
            bigBlindAmount: 0,
            dealer: null,
            smallBlindPlayer: null,
            bigBlindPlayer: null,
        },
    };

    const createPlayersForTable = (players) =>
        players.map((player) => ({
            name: player.name,
            chipCount: player.chipCount,
            potInvestment: 0,
            folded: false,
            allIn: false,
        }));

    const getMyPlayerName = () => name;
    const getTablePlayer = (name) => playerState.table.players.find((p) => p.name === name);
    const getMyPlayer = () => getTablePlayer(getMyPlayerName());
    const addPotInvestmentToPlayer = (name, amount) => {
        playerState.potTotal = playerState.potTotal + amount;

        const p = getTablePlayer(name);
        if (!p) {
            console.error('*** error, addPotInvestmentToPlayer(): no player by name ' + name);
            return;
        }
        p.potInvestment = p.potInvestment + amount;
    };

    const gameStateEmitter = new emitters.EventEmitter();

    gameStateEmitter.on(events.CommunityHasBeenDealtACardEvent, (event) => {
        playerState.communityCards.push(event.card);
    });

    gameStateEmitter.on(events.PlayerBetBigBlindEvent, (event) => {
        addPotInvestmentToPlayer(event.player.name, event.bigBlind);
    });

    gameStateEmitter.on(events.PlayerBetSmallBlindEvent, (event) => {
        addPotInvestmentToPlayer(event.player.name, event.smallBlind);
    });

    gameStateEmitter.on(events.PlayerCalledEvent, (event) => {
        addPotInvestmentToPlayer(event.player.name, event.callBet);
        if (event.player.chipCount === 0) {
            getTablePlayer(event.player.name).allIn = true;
        }
    });

    gameStateEmitter.on(events.PlayerRaisedEvent, (event) => {
        addPotInvestmentToPlayer(event.player.name, event.raiseBet);
        if (event.player.chipCount === 0) {
            getTablePlayer(event.player.name).allIn = true;
        }
    });
    gameStateEmitter.on(events.PlayerWentAllInEvent, (event) => {
        addPotInvestmentToPlayer(event.player.name, event.allInAmount);
        getTablePlayer(event.player.name).allIn = true;
    });

    gameStateEmitter.on(events.PlayIsStartedEvent, (event) => {
        playerState.isPlaying = event.players.map((player) => player.name).filter((n) => n === name);
        playerState.isTableDone = false;
        playerState.tableId = event.tableId;
        playerState.myCards = [];
        playerState.communityCards = [];
        playerState.potTotal = 0;
        playerState.winner = null;

        playerState.table.state = '';
        playerState.table.players = createPlayersForTable(event.players);
        playerState.table.smallBlindAmount = event.smallBlindAmount;
        playerState.table.bigBlindAmount = event.bigBlindAmount;
        playerState.table.dealer = event.dealer;
        playerState.table.smallBlindPlayer = event.smallBlindPlayer;
        playerState.table.bigBlindPlayer = event.bigBlindPlayer;

        playerState.amount = getMyPlayer() ? getMyPlayer().chipCount : 0;
    });

    gameStateEmitter.on(events.ShowDownEvent, (event) => {
        event.playersShowDown
            .map((playerShowDown) => playerShowDown.player)
            .forEach((p) => {
                getTablePlayer(p.name).chipCount = p.chipCount;
            });
        playerState.amount = getMyPlayer() ? getMyPlayer().chipCount : 0;
    });

    gameStateEmitter.on(events.TableChangedStateEvent, (event) => {
        playerState.table.state = event.state;
        //event.state;
    });

    gameStateEmitter.on(events.TableIsDoneEvent, (event) => {
        playerState.isTableDone = true;
        const sorted = sortPlayersByChipCount(event.players);
        playerState.winner = sorted[sorted.length - 1];
    });

    gameStateEmitter.on(events.YouHaveBeenDealtACardEvent, (event) => {
        playerState.myCards.push(event.card);
    });

    gameStateEmitter.on(events.YouWonAmountEvent, (event) => {
        playerState.amount = event.yourChipAmount;
    });

    const hasPlayerFolded = (name) => {
        return playerState.table.players.filter((player) => player.name === name && player.folded).length > 0;
    };

    const hasPlayerGoneAllIn = (name) => {
        return playerState.table.players.filter((p) => p.name === name && p.allIn).length > 0;
    };

    const getInvestmentInPotFor = (name) => {
        const player = getTablePlayer(name);
        return player ? player.potInvestment : 0;
    };

    /**
     * The game state holds various convenience methods for keeping track of the game.
     */
    const gameState = {
        /**
         * Gets the name of my player (my bot name)
         */
        getMyPlayerName,

        /**
         * Gets info about a specific player. The provided info contains the following attributes:
         * - name: the name of the player
         * - chipCount: the player's chip count
         * - potInvestment: how much the player has invested in the pot
         * - folder: has the player folded (true/false)
         * - allIn: has the player gone all in (true/false)
         *
         * @param {string} name The name of the player.
         */
        getTablePlayer,

        /**
         * Gets a list of all the players. Each player has the following attributes:
         * - name: the name of the player
         * - chipCount: the player's chip count
         * - potInvestment: how much the player has invested in the pot
         * - folder: has the player folded (true/false)
         * - allIn: has the player gone all in (true/false)
         */
        getTablePlayers: () => playerState.table.players,

        /**
         * Gets your player i.e. the bot player. Your player has the following attributes:
         * - name: the name of the player
         * - chipCount: the player's chip count
         * - potInvestment: how much the player has invested in the pot
         * - folder: has the player folded (true/false)
         * - allIn: has the player gone all in (true/false)
         */
        getMyPlayer,

        /**
         * Returns true if the player with the provided name has folded.
         *
         * @param {string} name The name of the player
         * @returns {boolean} True if the player with the provided name has folded
         */
        hasPlayerFolded,

        /**
         * Returns true if the player with the provided name has gone all in.
         *
         * @param {string} name The name of the player
         * @returns {boolean} True if the player with the provided name has gone all in
         */
        hasPlayerGoneAllIn,

        /**
         * Gets the pot investment for the specified player.
         *
         * @param {string} name The name of the player
         * @returns {number} The pot investment
         */
        getInvestmentInPotFor,

        /**
         * Returns true if your bot is still in the game.
         *
         * @returns {boolean} True if your bot is still in the game
         */
        amIStillInGame: () => playerState.isPlaying,

        /**
         * @returns {boolean} true if your bot is the winner
         */
        amIWinner: () => playerState.winner && playerState.winner.name === getMyPlayerName(),

        /**
         * @returns {boolean} true if your bot is the current dealer
         */
        amIDealerPlayer: () => playerState.table.dealer.name === getMyPlayerName(),

        /**
         * @returns {boolean} true if your bot has the small bline
         */
        amISmallBlindPlayer: () => playerState.table.smallBlindPlayer.name === getMyPlayerName(),

        /**
         * @returns {boolean} true if your bot has the big blind
         */
        amIBigBlindPlayer: () => playerState.table.bigBlindPlayer.name === getMyPlayerName(),

        /**
         * @returns {boolean} true if your bot has folded
         */
        haveIFolded: () => hasPlayerFolded(getMyPlayerName()),

        /**
         * @returns {boolean} true if your bot has gone all in
         */
        haveIGoneAllIn: () => hasPlayerGoneAllIn(getMyPlayerName()),

        /**
         * @returns {number} get your investment in the pot
         */
        getMyInvestmentInPot: () => getInvestmentInPotFor(getMyPlayerName()),

        /**
         * Returns an array containing your two hidden cards. Each card contains the attributes rank and suit.
         * @returns {Array} Your two hidden cards
         */
        getMyCards: () => [...playerState.myCards],

        /**
         * Returns an array containing only the community cards i.e. the cards on the table excluding your two hidden cards.
         * Each card contains the attributes rank and suit.
         *
         * @returns {Array} Your cards AND the community cards
         */
        getCommunityCards: () => playerState.communityCards,

        /**
         * Returns an array containing your two hidden cards AND the community cards (the open cards on the table).
         * Each card contains the attributes rank and suit.
         *
         * @returns {Array} Your cards AND the community cards
         */
        getMyCardsAndCommunityCards: () => [...playerState.myCards, ...playerState.communityCards],

        /**
         * @returns {number} The table id, useful for logging or when you need to trace a game in the UI
         */
        getTableId: () => playerState.tableId,

        /**
         * Gets the current table state which can be pre flop, flop, turn, river or showdown. The states
         * are defined in the enum named tableStates.
         *
         * Example:
         * import {
         *     tableStates,
         * } from '@cygni/poker-client-api';
         *
         * // Setup bot...
         *
         * const status = bot.getGameState().getTableState();
         * if (status === tableStates.flop) {
         *     // do flop stuff
         * }
         *
         * @returns {Object} The table state, defined in the enum tableStates
         */
        getTableState: () => playerState.table.state,

        /**
         * Gets the total value of the current pot.
         * @returns The pot total
         */
        getPotTotal: () => playerState.potTotal,

        /**
         * Get the value of the small blind. The small blind (and the big blind) is continuously raised
         * so this value will increase over time.
         *
         * @returns The small blind amount.
         */
        getSmallBlindAmount: () => playerState.table.smallBlindAmount,

        /**
         * Get the value of the big blind. The big blind (and the small blind) is continuously raised
         * so this value will increase over time.
         *
         * @returns The big blind amount.
         */
        getBigBlindAmount: () => playerState.table.bigBlindAmount,

        /**
         * Gets your total chip count i.e. how much money you have.
         *
         * @returns Your chip count
         */
        getMyChips: () => playerState.amount,
    };

    return { gameState, gameStateEmitter };
};
