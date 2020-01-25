import _ from 'lodash';

const rankmap = {
    'TWO': 2,
    'THREE': 3,
    'FOUR': 4,
    'FIVE': 5,
    'SIX': 6,
    'SEVEN': 7,
    'EIGHT': 8,
    'NINE': 9,
    'TEN': 10,
    'JACK': 11,
    'QUEEN': 12,
    'KING': 13,
    'ACE': 14,
};

const getOrThrow = (value, message) => {
    if (value) {
        return value;
    }

    throw new Error(message || 'Unable to get value');
};

export const analyzePokerHand = (myCardsAndCommunityCards) => {
    // Create Cards from array of poker cards { rank:"TEN", suit:"CLUBS"}
    function createCards(cardsArr) {
        const isEmpty = () => cardsArr ? cardsArr.length === 0 : false;

        // Group cards according to grouping condition function.
        // The function should return true if the previous and
        // next card and should be grouped.
        // The result is an array of cardgroups(arrays) sorted by length.
        const groupAny = (groupFunction) => {
            if (isEmpty()) {
                return [[]];
            }

            const arrInit = [[first(cardsArr)]];
            return _.sortBy(cardsArr
                .from(1)
                .reduce(
                    (arr, next) => {
                        const currentArr = last(arr);
                        const prev = last(currentArr);
                        if (groupFunction(prev, next)) {
                            //console.log(""+next.asString+" is grouped with "+prev.asString);
                            currentArr.push(next);
                        } else {
                            // else put in new group
                            //console.log(""+next.asString+" is put in new group");
                            arr.push([next]);
                        }
                        return arr;
                    },
                    arrInit
                ), arr => arr.length);

            // .sortBy(function (arr) {
            //     // sort group arr so that longest arr comes last
            //     return arr.length;
            // }); // [ [S,S,S,S,S] , [D,D] ] -> [ [D,D], [S,S,S,S,S] ] ->
        };

        function group(groupFunction, minLength) {
            var sortedGroup = groupAny(groupFunction);
            // Get the last arr in group if length is sufficient
            var longest = last(sortedGroup); // [S,S,S,S,S]
            if (longest.length >= minLength) {
                return createCards(longest);
            }
            return createCards([]);
        }

        const sameRankFn = (prev, next) => next.rank === prev.rank;
        const straightFn = (prev, next) => next.rank === (prev.rankPrevStraight + 1);
        const flushFn = (prev, next) => next.suit === prev.suit;

        const last = arr => isEmpty(arr) ? undefined : arr[arr.length - 1];
        const first = arr => isEmpty(arr) ? undefined : arr[0];

        return {
            highestRank: () => {
                return last(cardsArr) && last(cardsArr).rank || undefined;
            },
            lowestRank: () => {
                return first(cardsArr) && first(cardsArr).rank || undefined;
            },
            isHand: () => cardsArr.length >= 5,

            hasAce: () => last(cardsArr) && last(cardsArr).rank == 14,

            isFlush: () => {
                return this.flushCards().bestRanked().isHand();
            },
            // [ D1,S2,S4,D8,S8,S9,S10] -> [D1,D8,S2,S4,S8,S8,S10]
            sortedByRank: () => createCards(_.sortBy(cardsArr, c => c.rank)),
            sortedBySuit: () => createCards(_.sortBy(cardsArr, c => c.suit)),
            straightCards: () => {
                // [ [2,3], [5,6,7,8,9] ] -> [5,6,7,8,9]
                // [ [2], [5,6,7,8,9,10] ] -> [5,6,7,8,9,10]
                // [ [2], [4,5,6], [8,9] ] -> [] empty Cards
                // [ [2,3,4], [Q,K,A] ] -> [A,2,3,4] (A->1)
                // For this last case we create a new cardsArr with injected ACE before 2:
                // [ [2,3,4,5], [Q,K,A] ] -> [ [A,2,3,4,5], [Q,K,A] ] which will then give us the
                // longest consequtive sequence [A,2,3,4,5]
                let arrStraightCards = cardsArr;
                if (this.hasAce()) {
                    arrStraightCards = [last(cardsArr)].add(cardsArr);
                }
                const unsorted = createCards(arrStraightCards).straightCards2();
                const sorted = unsorted.sortedByRank();
                return sorted;
            },
            // TODO: internal fn only used by straightCards():
            straightCards2: () => {
                return group(straightFn, 5);
            },

            // TODO: instead create a sorted&Curried array/card for
            // the three cases.
            // flush: suit-sorted and curried with flushFn etc
            flushCards: () => {
                return this.sortedBySuit().flushCards2();
            },

            flushCards2: () => {
                // [ [D,D], [S,S,S,S,S] ] -> [S,S,S,S,S]
                return group(flushFn, 5); //  [S,S,S,S,S]
            },

            handOrNull: () => {
                return this.isHand() ? this : null;
            },

            // Get five best ranked cards
            bestRanked: () => {
                // TODO: fixme
                return createCards(cardsArr.last(5));
            },

            // get Cards or null for given arrays of lengths sorted by highest first
            // [3,2] -> requests rank groups of lenght 3 and 2 (full house)
            // [4] -> fourOfAKind
            // [2,2] -> two pair
            getBestRanked: (lengths) => {
                var rankGroups = groupAny(sameRankFn);

                var matchingGroups = lengths.reduce((arr, next) => {
                    // match against next from rankGroups
                    var grp = rankGroups.pop(); // last elements are biggest/longest
                    if (grp && grp.length === next) {
                        arr.push(grp);
                        //var grpstr = createCards(grp).asString();
                        //console.log("req len="+next+" grp="+grpstr);
                    }
                    return arr;
                }, []);

                if (matchingGroups.length === lengths.length) {
                    // unwrap groups to flat array
                    return createCards(matchingGroups.flatten());
                } else {
                    return null;
                }
            },
            asString: () => {
                return cardsArr.map((c) => {
                    return '{' + c.rank + ',' + c.suit + '}';
                });
            }
        };
    }

    // Private state

    const allcardsArr = _.sortBy(
        myCardsAndCommunityCards.map((c) => {
            const rankAsNumber = getOrThrow(rankmap[c.rank], `Illegal card rank [rank=${c.rank}, valid=${Object.keys(rankmap)}]`);

            return {
                rank: rankAsNumber,
                rankPrevStraight: rankAsNumber == 14 ? 1 : rankAsNumber,
                suit: c.suit,
                org: c,
                asString: 'rank:' + c.rank + ' suite:' + c.suit
            };
        }),
        c => c.rank
    );

    var allCards = createCards(allcardsArr);
    var flushCards = allCards.flushCards();
    // var handCards = allCards.handOrNull();
    var emptyCards = createCards([]);

    // Private functions

    // Choose the straight from the top ranked card
    const bestStraight = () => allCards.straightCards().bestRanked().handOrNull();

    const getRoyalFlush = () => {
        const straightFlush = getStraightFlush() || emptyCards;
        if (straightFlush.isHand()
            && straightFlush.hasAce()
            && straightFlush.lowestRank() !== 2) {
            return straightFlush;
        }
        return null;
    };

    const getStraightFlush = () => {
        var beststraight = bestStraight() || emptyCards;
        return beststraight.isFlush() && beststraight || null;
    };

    const getFourOfAKind = () => {
        return allCards.getBestRanked([4]);
    };

    const getFullHouse = () => {
        return allCards.getBestRanked([3, 2]);
    };

    const getFlush = () => {
        return flushCards.handOrNull();
    };

    const getStraight = () => {
        return bestStraight();
    };

    const getThreeOfAKind = () => {
        return allCards.getBestRanked([3]);
    };

    const getTwoPairs = () => {
        return allCards.getBestRanked([2, 2]);
    };

    const getOnePair = () => {
        return allCards.getBestRanked([2]);
    };

    const getHighHand = () => {
        return allCards.bestRanked().handOrNull();
    };


    // eslint-disable-next-line complexity
    const getBestHand = () => {
        return getRoyalFlush()
            || getStraightFlush()
            || getFourOfAKind()
            || getFullHouse()
            || getFlush()
            || getStraight()
            || getThreeOfAKind()
            || getTwoPairs()
            || getOnePair()
            || getHighHand();
    };

    const pokerhand = {

        cards: allCards,
        bestHand: getBestHand,
        asString: () => {
            return allcardsArr.map(function (c) {
                return '{' + c.rank + ',' + c.suit + '}';
            });
        },

        isRoyalFlush: () => {
            return getRoyalFlush() != null;
        },
        isStraightFlush: () => {
            return getStraightFlush() != null;
        },
        isFourOfAKind: () => {
            return getFourOfAKind() != null;
        },
        isFullHouse: () => {
            return getFullHouse() != null;
        },
        isFlush: () => {
            return getFlush() != null;
        },
        isStraight: () => {
            return getStraight() != null;
        },
        isThreeOfAKind: () => {
            return getThreeOfAKind() != null;
        },
        isTwoPairs: () => {
            return getTwoPairs() != null;
        },
        isOnePair: () => {
            return getOnePair() != null;
        },
        isHighHand: () => {
            return getHighHand() != null;
        },
    };

    return pokerhand;
};


const getFlushCards = cards => _.chain(cards).groupBy('suit');

export const analyze2 = (myCardsAndCommunityCards) => {


    return {
        flushCards: () => getFlushCards(myCardsAndCommunityCards)
        // cards: allCards,
        // bestHand: getBestHand,
        // asString: () => {
        //     return allcardsArr.map(function (c) {
        //         return '{' + c.rank + ',' + c.suit + '}';
        //     });
        // },

        // isRoyalFlush: () => {
        //     return getRoyalFlush() != null;
        // },
        // isStraightFlush: () => {
        //     return getStraightFlush() != null;
        // },
        // isFourOfAKind: () => {
        //     return getFourOfAKind() != null;
        // },
        // isFullHouse: () => {
        //     return getFullHouse() != null;
        // },
        // isFlush: () => {
        //     return getFlush() != null;
        // },
        // isStraight: () => {
        //     return getStraight() != null;
        // },
        // isThreeOfAKind: () => {
        //     return getThreeOfAKind() != null;
        // },
        // isTwoPairs: () => {
        //     return getTwoPairs() != null;
        // },
        // isOnePair: () => {
        //     return getOnePair() != null;
        // },
        // isHighHand: () => {
        //     return getHighHand() != null;
        // },
    };
};

