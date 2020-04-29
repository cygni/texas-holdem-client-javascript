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

export const actions = {
    raise: 'RAISE',
    call: 'CALL',
    check: 'CHECK',
    fold: 'FOLD',
    allIn: 'ALL_IN',
};

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

export const rooms = {
    training: () => TRAINING,
    tournament: () => TOURNAMENT,
    freeplay: () => FREEPLAY,
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

export const tableStates = {
    preflop: 'PRE_FLOP',
    flop: 'FLOP',
    turn: 'TURN',
    river: 'RIVER',
    showdown: 'SHOWDOWN',
};

export const suits = {
    clubs: 'CLUBS',
    diamonds: 'DIAMONDS',
    spades: 'SPADES',
    hearts: 'HEARTS',
};

export const ranks = {
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


