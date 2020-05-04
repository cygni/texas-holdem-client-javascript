import net from 'net';
import emitters from 'events';

import { setupGameState } from './game-state.js';
import {
    extractParts,
    jsonDelimiter,
    classifiers,
    createRegisterForPlayRequest,
    actions,
    rooms,
    requests,
    createActionResponse,
} from './protocol.js';

const isActionRequest = ({ request }) => request.name === requests.actionRequest;

const handleRequest = async ({ request, dispatcher, client }) => {
    if (isActionRequest({ request })) {
        const action = await dispatcher.handleActionRequest(request.possibleActions);
        validateAction({ action, possibleActions: request.possibleActions });

        const actionResponse = createActionResponse({ action, request });
        client.write(`${JSON.stringify(actionResponse)}${jsonDelimiter}`);
    } else {
        console.log('Skipping request: ', request);
    }
};

const beautify = ({ event }) => {
    const { name, classifier } = extractParts({ event });

    // Make the event a bit friendlier to use
    event.name = name;
    event.classifier = classifier;

    return event;
};

const routeEvent = async ({ client, event, dispatcher }) => {
    const e = beautify({ event });

    switch (e.classifier) {
    case classifiers.request:
        await handleRequest({ client, request: e, dispatcher });
        break;
    case classifiers.event:
        // TODO: can be async
        dispatcher.emit(event.name, e);
        break;
    case classifiers.exception:
        throw new Error(`Exception from server [event=${e.name}, message=${e.message}]`);
    default:
        // Ignore responses and similar
        break;
    }
};

const setupClient = ({ host, port, room, name, dispatcher }) => {
    console.log('Setting up client ', { host, port, room, name });
    const client = new net.Socket();
    client.setNoDelay(true);
    client.setKeepAlive(true, 0);

    client.on('close', () => console.log('Connection closed'));
    client.on('error', err => console.error('Socket Error: ', err));

    // Add a 'data' event handler for the client socket
    // data is what the server sent to this socket
    let saveForNext;

    // TODO: rewrite this mess
    // eslint-disable-next-line complexity
    client.on('data', async (data) => {
        let stringData = data.toString();
        if (saveForNext) {
            stringData = saveForNext + stringData;
            saveForNext = null;
        }
        const isComplete = stringData.endsWith(jsonDelimiter);
        const jsonArr = stringData.split(jsonDelimiter);
        let jsonStr;

        while (jsonArr.length > 0) {
            jsonStr = jsonArr.shift();
            if (jsonArr.length === 0 && !isComplete) {
                saveForNext = jsonStr; // if last in array is incomplete then save it and exit
                break;
            }

            if (jsonStr) {
                await routeEvent({ client, event: JSON.parse(jsonStr), dispatcher });
            }
        }
    });

    return {
        connect: () => {
            client.connect(port, host, () => {
                console.log('Connected to: ' + host + ':' + port);
                client.write(`${JSON.stringify(createRegisterForPlayRequest({ name, room }))}${jsonDelimiter}`);
                console.log(`Play registered [room=${room}, name=${name}]`);
            });
        }
    };
};

const validateAction = ({ action, possibleActions }) => {
    // Validate that a correct action
    if (!action) {
        throw new Error(`Undefined action from the request handler [action=${action}, valid=[${Object.values(actions).join(', ')}]]`);
    }
    
    if (!Object.values(actions).includes(action.actionType)) {
        throw new Error(`Invalid action from the request handler [action=${action.actionType}, valid=[${Object.values(actions).join(', ')}]]`);
    }

    const possibleActionNames = possibleActions.map(a => a.actionType);
    if (!possibleActions.map(a => a.actionType).includes(action.actionType)) {
        throw new Error(`Action not possible [action=${action}, possible=[${possibleActionNames.join(', ')}]]`);
    }
};

const setupPossibleActions = (possibleActions) => {
    let raiseAction, callAction, checkAction, foldAction, allInAction;

    possibleActions
        // eslint-disable-next-line complexity
        .forEach((action) => {
            switch (action.actionType) {
            case actions.raise:
                raiseAction = action;
                break;
            case actions.call:
                callAction = action;
                break;
            case actions.check:
                checkAction = action;
                break;
            case actions.fold:
                foldAction = action;
                break;
            case actions.allIn:
                allInAction = action;
                break;
            default:
                break;
            }
        });
    return { raiseAction, callAction, checkAction, foldAction, allInAction };
};

/**
 * Creates a bot with the provided name. The bot must do (at least) the following:
 * 
 * 1. Register an action handler by invoking @see {registerActionHandler}.
 * 2. Connect to the server by invoking @see {connect}.
 * 
 * In addition to this the bot can access all of the events by listening to them. Furthermore, 
 * the bot can at any time access the game state by invoking @see {getGameState}.
 * @param {string} name The name of your marvelous poker bot.
 */
export const createBot = ({ name }) => {
    const { gameState, gameStateEmitter } = setupGameState({ name });

    const playerEmitter = new emitters.EventEmitter();
    const actionRequestHandler = {};

    // This is the "write"-side of the player, only used internally to emit events
    // and to handle action requests
    const dispatcher = {
        emit: (name, event) => {
            gameStateEmitter.emit(name, event);
            playerEmitter.emit(name, event);
        },
        handleActionRequest: async (possibleActions) => actionRequestHandler
            .handleActionRequest(setupPossibleActions(possibleActions)),
    };

    return {
        /**
         * Connect to the server. Here you specify the host, port and poker room.
         * 
         * @see rooms
         * @param {string} host the poker host, defaults to 'host.docker.internal' which is the docker host
         * @param {number} port the port, defaults to 4711
         * @param {string} room the poker room, defaults to the training room. To select other rooms see the `rooms` enum
         */
        connect: (config = {
            host: process.env.POKER_HOST || 'host.docker.internal',
            port: process.env.POKER_PORT || 4711,
            room: process.env.POKER_ROOM || rooms.training(),
        }) => {
            const client = setupClient({ ...config, name, dispatcher });
            client.connect();
        },

        /**
         * Returns the game state which holds information about the current game. The game state is
         * important to find out the state of the players and the table. E.g. the functions amIBigBlind(),
         * getMyCards() etc.
         */
        getGameState: () => gameState,

        /**
         * Registers your action handler which is the piece of code where you place your logic. Here
         * you should provide a callback that will be invoked when it is your turn to do any actions.
         * 
         * The parameters sent to the callback are: { allInAction, raiseAction, callAction, checkAction, foldAction }.
         * If an action can not be performed (e.g if you cant check) that action will be undefined.
         * 
         * @param {function} handler The callback that will be invoked where you place your logic.
         */
        registerActionHandler: (handler) => {
            console.log('Registering action handler');
            actionRequestHandler.handleActionRequest = handler;
        },

        /**
         * Registers a listener for an event.
         * 
         * Usage: bot.on(events.PlayIsStartedEvent, (event) => { ... });
         * 
         * @param {string} name the event name, all events are listed in the `events` enum
         * @param {function} callback the listener (a callback)
         */
        on: (name, callback) => {
            // Return values in callbacks are completely ignored as per the EventEmitter-pattern.
            playerEmitter.on(name, callback);
        },
    };
};
