import uuid from 'uuid';

export const jsonDelimiter = '_-^emil^-_';

export const extractParts = ({ event }) => {
    const { type } = event;
    const parts = type.split('.');
    const name = parts.pop();
    const classifier = parts.pop();

    return { name, classifier };
};

export const classifiers = {
    event: 'event',
    exception: 'exception',
    request: 'request',
    response: 'response',
};

export const createRegisterForPlayRequest = ({ name, room }) => ({
    type: 'se.cygni.texasholdem.communication.message.request.RegisterForPlayRequest',
    sessionId: '',
    requestId: uuid.v4(),
    name,
    room
});

export const createActionResponse = ({ action, request }) => ({
    type: 'se.cygni.texasholdem.communication.message.response.ActionResponse',
    requestId: request.requestId,
    action
});

/**
 * Enum with names of all actions that your bot may do during a game.
 */
export const actions = {
    raise: 'RAISE',
    call: 'CALL',
    check: 'CHECK',
    fold: 'FOLD',
    allIn: 'ALL_IN',
};

/**
 * Enum containing the names of all the events that may occur during a game.
 */
export const events = {
    RegisterForPlayResponse: 'RegisterForPlayResponse',
    PlayIsStartedEvent: 'PlayIsStartedEvent',
    CommunityHasBeenDealtACardEvent: 'CommunityHasBeenDealtACardEvent',
    PlayerBetBigBlindEvent: 'PlayerBetBigBlindEvent',
    PlayerBetSmallBlindEvent: 'PlayerBetSmallBlindEvent',
    PlayerCalledEvent: 'PlayerCalledEvent',
    PlayerCheckedEvent: 'PlayerCheckedEvent',
    PlayerFoldedEvent: 'PlayerFoldedEvent',
    PlayerForcedFoldedEvent: 'PlayerForcedFoldedEvent',
    PlayerQuitEvent: 'PlayerQuitEvent',
    PlayerRaisedEvent: 'PlayerRaisedEvent',
    PlayerWentAllInEvent: 'PlayerWentAllInEvent',
    ServerIsShuttingDownEvent: 'ServerIsShuttingDownEvent',
    ShowDownEvent: 'ShowDownEvent',
    TableChangedStateEvent: 'TableChangedStateEvent',
    TableIsDoneEvent: 'TableIsDoneEvent',
    YouHaveBeenDealtACardEvent: 'YouHaveBeenDealtACardEvent',
    YouWonAmountEvent: 'YouWonAmountEvent',
};

export const requests = {
    actionRequest: 'ActionRequest'
};

const TRAINING = 'TRAINING';
const TOURNAMENT = 'TOURNAMENT';
const FREEPLAY = 'FREEPLAY';

/**
 * "Enum" for the various rooms (actually functions). Values are training, tournament and freeplay.
 */
export const rooms = {
    /**
     * @returns The name of the training room where you train your bots against the training bots on the server.
     */
    training: () => TRAINING,

    /**
     * @returns The name of the tournament room where you compete against other bots.
     */
    tournament: () => TOURNAMENT,

    /**
     * @returns The name of the freeplay room where you can train your bots in tournament-like style (rarely used).
     */
    freeplay: () => FREEPLAY,

    /**
     * Used to validate that a correct room has been entered.
     * @param room The name of the room
     * @returns true if valid, otherwise an exception is thrown
     */
    validate: (room) => {
        switch (room) {
        case TRAINING:
        case TOURNAMENT:
        case FREEPLAY:
            return true;

        default:
            throw new Error(`Unable to validate room [room=${room}, valid=${[TRAINING, TOURNAMENT, FREEPLAY].join(', ')}]`);
        }
    }
};

/**
 * Enum for the various table states. Values are preflop, flop, turn, river, showdown.
 */
export const tableStates = {
    preflop: 'PRE_FLOP',
    flop: 'FLOP',
    turn: 'TURN',
    river: 'RIVER',
    showdown: 'SHOWDOWN',
};

/**
 * Enum for card suits. A card consists of a suit (e.g. hearts) and a rank (e.g. four).
 * The suits are clubs, diamonds, spades and hearts.
 */
export const suits = {
    clubs: 'CLUBS',
    diamonds: 'DIAMONDS',
    spades: 'SPADES',
    hearts: 'HEARTS',
};

/**
 * Enum for card ranks (NOT hand rankings). The card rank basically describes the value of the card
 * where the highest is the ace, and the lowest is the deuce (value 2).
 */
export const ranks = {
    /** Deuce, or simply a 2 */
    deuce: 'DEUCE',
    three: 'THREE',
    four: 'FOUR',
    five: 'FIVE',
    six: 'SIX',
    seven: 'SEVEN',
    eight: 'EIGHT',
    nine: 'NINE',
    ten: 'TEN',
    jack: 'JACK',
    queen: 'QUEEN',
    king: 'KING',
    ace: 'ACE',
};


