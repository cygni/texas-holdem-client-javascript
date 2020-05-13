Examples of all responses and requests to and from server/client are described below.

-   `RegisterForPlayResponse`: The response after connecting

```yaml
{
    'type': 'se.cygni.texasholdem.communication.message.response.RegisterForPlayResponse',
    'version': '1.1.22-SNAPSHOT',
    'requestId': 'fb241038-4524-48b4-b5f5-0850f0b73096',
    'sessionId': 'a33f3dde-16d1-482d-98c4-52ee6873b23f',
}
```

-   `PlayIsStartedEvent`: when the play has - well - started. It contains a list of players and their current chip count, which players are acting as dealer, big blind and small blind together with the current amounts for big- small blinds. If you want to find the game in the web interface you can search for it with the tableId under the tab called "Show games".

```yaml
{
    'players':
        [
            { 'name': 'Rookie', 'chipCount': 10000 },
            { 'name': 'Hellmuth', 'chipCount': 10000 },
            { 'name': 'Cautious', 'chipCount': 10000 },
            { 'name': 'Raiser', 'chipCount': 10000 },
            { 'name': 'JohnnyPuma', 'chipCount': 10000 },
            { 'name': 'Sensible', 'chipCount': 10000 },
        ],
    'smallBlindAmount': 5,
    'bigBlindAmount': 10,
    'dealer': { 'name': 'Rookie', 'chipCount': 10000 },
    'smallBlindPlayer': { 'name': 'Hellmuth', 'chipCount': 10000 },
    'bigBlindPlayer': { 'name': 'Cautious', 'chipCount': 10000 },
    'tableId': 32,
    'type': 'se.cygni.texasholdem.communication.message.event.PlayIsStartedEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `CommunityHasBeenDealtACardEvent`: Whenever a card is added to the Community all clients recieve this event.

```yaml
{
    'card': { 'rank': 'FOUR', 'suit': 'SPADES' },
    'type': 'se.cygni.texasholdem.communication.message.event.CommunityHasBeenDealtACardEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `PlayerBetBigBlindEvent`: Big blinds are placed automatically by the game server. A notification is sent to all clients when this happens. The player placing the big blind and the amount is included in the event.

```yaml
{
    'player': { 'name': 'Cautious', 'chipCount': 9990 },
    'bigBlind': 10,
    'type': 'se.cygni.texasholdem.communication.message.event.PlayerBetBigBlindEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `PlayerBetSmallBlindEvent`: Small blinds are placed automatically by the game server. A notification is sent to all clients when this happens. The player placing the small blind and the amount is included in the event.

```yaml
{
    'player': { 'name': 'Hellmuth', 'chipCount': 9995 },
    'smallBlind': 5,
    'type': 'se.cygni.texasholdem.communication.message.event.PlayerBetSmallBlindEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `ActionRequest`: Whenever a client needs to take som action an ActionRequest is sent to that client. It contains a list of `possibleActions`currently available and the amount of chips it costs. Whenever this request is received the client has a specified time (default 3 seconds) to send a response. See `ActionResponse`.

```yaml
{
    'type': 'se.cygni.texasholdem.communication.message.request.ActionRequest',
    'version': '1.1.22-SNAPSHOT',
    'sessionId': null,
    'requestId': 'be6370aa-7dde-4b69-8e57-60b90f3836f8',
    'possibleActions':
        [
            { 'actionType': 'FOLD', 'amount': 0 },
            { 'actionType': 'CALL', 'amount': 10 },
            { 'actionType': 'ALL_IN', 'amount': 10000 },
            { 'actionType': 'RAISE', 'amount': 20 },
        ],
}
```

-   `ActionResponse`: This is the response to an `ActionRequest`. It includes the choosen action and possibly an amount.

```yaml
{
    'type': 'se.cygni.texasholdem.communication.message.response.ActionResponse',
    'requestId': 'be6370aa-7dde-4b69-8e57-60b90f3836f8',
    'action': { 'actionType': 'RAISE', 'amount': 20 },
}
```

-   `PlayerCalledEvent`: When a player calls all clients are notifed. The amount necessary to call is included in the event.

```yaml
{
    'player': { 'name': 'Raiser', 'chipCount': 9990 },
    'callBet': 10,
    'type': 'se.cygni.texasholdem.communication.message.event.PlayerCalledEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `PlayerCheckedEvent`: Whenever a player checks all clients are informed of this.

```yaml
{
    'player': { 'name': 'Hellmuth', 'chipCount': 9960 },
    'type': 'se.cygni.texasholdem.communication.message.event.PlayerCheckedEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `PlayerFoldedEvent`: Whenever a player folds all clients are informed of this. The event includes which player folded and the amount of chips the player had invested in the pot.

```yaml
{
    'player': { 'name': 'JohnnyPuma', 'chipCount': 10000 },
    'investmentInPot': 0,
    'type': 'se.cygni.texasholdem.communication.message.event.PlayerFoldedEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `PlayerForcedFoldedEvent`: If a client responds to an `ActionRequiredRequest` with an invalid action or does not respond at all the game server forces a fold.

```yaml
{
    'player': { 'name': 'JohnnyPuma', 'chipCount': 7540 },
    'investmentInPot': 40,
    'type': 'se.cygni.texasholdem.communication.message.event.PlayerFoldedEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `PlayerQuitEvent`: If a client is suddenly disconnected

```yaml
{
    'player': { 'name': 'Rookie', 'chipCount': 10000 },
    'type': 'se.cygni.texasholdem.communication.message.event.PlayerQuitEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `PlayerRaisedEvent`: Whenever a player raises all clients are informed of this. The event includes which player raised and the amount of chips the raise was for.

```yaml
{
    'player': { 'name': 'Sensible', 'chipCount': 9980 },
    'raiseBet': 20,
    'type': 'se.cygni.texasholdem.communication.message.event.PlayerRaisedEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `PlayerWentAllInEvent`: Whenever a player goes all in all clients are informed of this. The event includes which player went all in and the amount of chips.

```yaml
{
    'player': { 'name': 'JohnnyPuma', 'chipCount': 0 },
    'allInAmount': 10000,
    'type': 'se.cygni.texasholdem.communication.message.event.PlayerWentAllInEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `ServerIsShuttingDownEvent`: This event is dispatched to any connected clients if the server has to be shutdown. Happens very rarely.

```yaml
{
    'message': 'Server is shutting down for maintenance',
    'type': 'se.cygni.texasholdem.communication.message.event.ServerIsShuttingDownEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `ShowDownEvent`: Just after the table enters state `SHOWDOWN` (this means the round is over and a winner has been decided) this event is sent to all clients. It contains a list of participating players, their best possible hand and how much is won. Sometimes the pot needs to be split (for example when a player goes all in but someone raises or if two players have the exact same hand) so there can be payouts to more than one player.

```yaml
{
    'playersShowDown':
        [
            {
                'player': { 'name': 'Cautious', 'chipCount': 9880 },
                'hand':
                    {
                        'cards':
                            [
                                { 'rank': 'JACK', 'suit': 'DIAMONDS' },
                                { 'rank': 'JACK', 'suit': 'SPADES' },
                                { 'rank': 'NINE', 'suit': 'HEARTS' },
                                { 'rank': 'NINE', 'suit': 'SPADES' },
                                { 'rank': 'KING', 'suit': 'HEARTS' },
                            ],
                        'pokerHand': 'TWO_PAIRS',
                        'folded': false,
                    },
                'wonAmount': 0,
            },
            {
                'player': { 'name': 'Raiser', 'chipCount': 9880 },
                'hand':
                    {
                        'cards':
                            [
                                { 'rank': 'KING', 'suit': 'CLUBS' },
                                { 'rank': 'KING', 'suit': 'HEARTS' },
                                { 'rank': 'FOUR', 'suit': 'HEARTS' },
                                { 'rank': 'FOUR', 'suit': 'SPADES' },
                                { 'rank': 'JACK', 'suit': 'SPADES' },
                            ],
                        'pokerHand': 'TWO_PAIRS',
                        'folded': false,
                    },
                'wonAmount': 0,
            },
            {
                'player': { 'name': 'Hellmuth', 'chipCount': 9880 },
                'hand':
                    {
                        'cards':
                            [
                                { 'rank': 'FOUR', 'suit': 'HEARTS' },
                                { 'rank': 'FOUR', 'suit': 'SPADES' },
                                { 'rank': 'KING', 'suit': 'HEARTS' },
                                { 'rank': 'JACK', 'suit': 'SPADES' },
                                { 'rank': 'NINE', 'suit': 'HEARTS' },
                            ],
                        'pokerHand': 'ONE_PAIR',
                        'folded': false,
                    },
                'wonAmount': 0,
            },
            {
                'player': { 'name': 'Sensible', 'chipCount': 9880 },
                'hand':
                    {
                        'cards':
                            [
                                { 'rank': 'KING', 'suit': 'HEARTS' },
                                { 'rank': 'QUEEN', 'suit': 'SPADES' },
                                { 'rank': 'JACK', 'suit': 'SPADES' },
                                { 'rank': 'TEN', 'suit': 'DIAMONDS' },
                                { 'rank': 'NINE', 'suit': 'HEARTS' },
                            ],
                        'pokerHand': 'STRAIGHT',
                        'folded': false,
                    },
                'wonAmount': 0,
            },
            {
                'player': { 'name': 'Rookie', 'chipCount': 10480 },
                'hand':
                    {
                        'cards':
                            [
                                { 'rank': 'FOUR', 'suit': 'CLUBS' },
                                { 'rank': 'FOUR', 'suit': 'HEARTS' },
                                { 'rank': 'FOUR', 'suit': 'SPADES' },
                                { 'rank': 'JACK', 'suit': 'HEARTS' },
                                { 'rank': 'JACK', 'suit': 'SPADES' },
                            ],
                        'pokerHand': 'FULL_HOUSE',
                        'folded': false,
                    },
                'wonAmount': 600,
            },
            {
                'player': { 'name': 'JohnnyPuma', 'chipCount': 10000 },
                'hand': { 'cards': [], 'pokerHand': 'NOTHING', 'folded': true },
                'wonAmount': 0,
            },
        ],
    'type': 'se.cygni.texasholdem.communication.message.event.ShowDownEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `TableChangedStateEvent`: Every time the table changes state all clients will be notified of this. Available states (in order) are: PRE_FLOP, FLOP, TURN, RIVER, SHOWDOWN

```yaml
{
    'state': 'PRE_FLOP',
    'type': 'se.cygni.texasholdem.communication.message.event.TableChangedStateEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `TableIsDoneEvent`: When a table stops playing this event is dispatched with a summary of the current chips placement between players. When in `TRAINING` mode the table game is ended when your bot has run out of chips. In `TOURNAMENT` mode the server can decide to rearrange players to new tables if one table has significantly fewer players.

```yaml
{
    'players':
        [
            { 'name': 'JohnnyPuma', 'chipCount': 0 },
            { 'name': 'Weighted', 'chipCount': 0 },
            { 'name': 'Raiser', 'chipCount': 40000 },
            { 'name': 'Sensible', 'chipCount': 0 },
            { 'name': 'Cautious', 'chipCount': 10000 },
            { 'name': 'Hellmuth', 'chipCount': 10000 },
        ],
    'type': 'se.cygni.texasholdem.communication.message.event.TableIsDoneEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `YouHaveBeenDealtACardEvent`: When ever you are dealt a card you will be notified of which card. A card consists of a rank (DEUCE, THREE ..., KING, ACE) and a suit (CLUBS, DIAMONDS, HEARTS, SPADES).

```yaml
{
    'card': { 'rank': 'DEUCE', 'suit': 'CLUBS' },
    'type': 'se.cygni.texasholdem.communication.message.event.YouHaveBeenDealtACardEvent',
    'version': '1.1.22-SNAPSHOT',
}
```

-   `YouWonAmountEvent`: Just before the `ShowDownEvent` all clients are informed of their part of the pot and how many chips the client has left to play for.

```yaml
{
    'wonAmount': 0,
    'yourChipAmount': 8400,
    'type': 'se.cygni.texasholdem.communication.message.event.YouWonAmountEvent',
    'version': '1.1.22-SNAPSHOT',
}
```
