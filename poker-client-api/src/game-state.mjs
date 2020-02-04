import emitters from 'events';
import { events } from './protocol.mjs';

const sortPlayersByChipCount = (players) => {
    return players.map(p => p).sort((left, right) => {
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
            bigBlindPlayer: null
        }
    };

    const createPlayersForTable = players => players.map(player => ({
        name: player.name,
        chipCount: player.chipCount,
        potInvestment: 0,
        folded: false,
        allIn: false
    }));


    const getMyPlayerName = () => name;
    const getTablePlayer = name => playerState.table.players.find(p => p.name === name);
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

        playerState.isPlaying = event.players.map(player => player.name).filter(n => n === name);
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
        event.playersShowDown.map(playerShowDown => playerShowDown.player).forEach(p => {
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
        return playerState.table.players.filter(player => player.name === name && player.folded).length > 0;
    };

    const hasPlayerGoneAllIn = (name) => {
        return playerState.table.players.filter(p => p.name === name && p.allIn).length > 0;
    };

    const getInvestmentInPotFor = (name) => {
        const player = getTablePlayer(name);
        return player ? player.potInvestment : 0;
    };

    const gameState = {
        getMyPlayerName,
        getTablePlayer,
        getTablePlayers: () => playerState.table.players,
        getMyPlayer,
        hasPlayerFolded,
        hasPlayerGoneAllIn,
        getInvestmentInPotFor,

        amIStillInGame: () => playerState.isPlaying,
        amIWinner: () => playerState.winner && playerState.winner.name === getMyPlayerName(),
        amIDealerPlayer: () => playerState.table.dealer === getMyPlayerName(),
        amISmallBlindPlayer: () => playerState.table.smallBlindPlayer === getMyPlayerName(),
        amIBigBlindPlayer: () => playerState.table.bigBlindPlayer === getMyPlayerName(),
        haveIFolded: () => hasPlayerFolded(getMyPlayerName()),
        haveIGoneAllIn: () => hasPlayerGoneAllIn(getMyPlayerName()),
        getMyInvestmentInPot: () => getInvestmentInPotFor(getMyPlayerName()),
        getMyCards: () => [...playerState.myCards],
        getMyCardsAndCommunityCards: () => [...playerState.myCards, ...playerState.communityCards],


        getTableId: () => playerState.tableId,
        getTableState: () => playerState.table.state,
        getCommunityCards: () => playerState.communityCards,
        getPotTotal: () => playerState.potTotal,
        getSmallBlindAmount: () => playerState.table.smallBlindAmount,
        getBigBlindAmount: () => playerState.table.bigBlindAmount,
        getMyChips: () => playerState.amount
    };

    return { gameState, gameStateEmitter };
};
