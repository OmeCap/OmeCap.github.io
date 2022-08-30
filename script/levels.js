/**
 * Levels: object which contains the game data for each level
 * @param {number} id - level id
 * @param {array} blocks - type of blocks available: {'move', 'turn', 'repeat_until', 
 *  'if_path', 'if_else_path} (include all if not defined)
 * @param {number} maxBlocks - the total number of blocks can be used 
 *  (infinity if not defined)
 * @param {object} game - object which contains the data for car, destination and path
 * @param {obejct} car - contains the coordinates of the start position of the car and its direction
 *  direction: {0: forward (up), 1: right, 2: backward (down), 3: left}
 * @param {object} destination - contains the corrdinates of the end point of the game
 * @param {array} path - path available: an arrary of [x, y]s
 */

 const levels = [
    {
        id: 1,
        blocks: [
            'move',
            'turn'
        ],
        game: {
            car: {
                direction: 1,
                x: 0,
                y: 0
            },
            destination: {
                x: 2,
                y: 1
            },
            path: [
                [0, 0],
                [1, 0],
                [1, 1],
                [2, 1]
            ]
        }
    },
    {
        id: 2,
        blocks: [
            'move',
            'repeat_until'
        ],
        game: {
            car: {
                direction: 1,
                x: 0,
                y: 0
            },
            destination: {
                x: 6,
                y: 0
            },
            path: [
                [0, 0],
                [1, 0],
                [2, 0],
                [3, 0],
                [4, 0],
                [5, 0],
                [6, 0]
            ]
        }
    },
    {
        id: 3,
        blocks: [
            'move',
            'turn',
            'if_path',
            'repeat_until',
            'collect'
        ],
        game: {
            car: {
                direction: 1,
                x: 0,
                y: 0
            },
            destination: {
                x: 0,
                y: 4
            },
            path: [
                [0, 0],
                [1, 0],
                [2, 0],
                [3, 0],
                [4, 0],
                [4, 1],
                [4, 2],
                [4, 3],
                [4, 4],
                [3, 4],
                [2, 4],
                [1, 4],
                [0, 4]
            ],
            coin: {
                totalNumber: 2,
                currentNumber: 0,
                coinPosition: [
                    [4, 0],
                    [4, 4]
                ]
            }
        }
    },
    {
        id: 4,
        blocks: [
            'move',
            'turn',
            'repeat_until',
            'if_else_path'
        ],
        game: {
            car: {
                direction: 0,
                x: 1,
                y: 0
            },
            destination: {
                x: 6,
                y: 0
            },
            path: [
                [1, 0],
                [1, 1],
                [1, 2],
                [0, 2],
                [2, 2],
                [3, 2],
                [4, 2],
                [5, 2],
                [5, 3],
                [4, 3],
                [5, 1],
                [5, 0],
                [6, 0]
            ]
        }
    },
    {
        id: 5,
        blocks: [
            'move',
            'turn',
            'repeat_until',
            'if_path',
            'if_else_path'
        ],
        maxBlocks: 10,
        game: {
            car: {
                direction: 1,
                x: 0,
                y: 0
            }
        },
        destination: {
            x: 3,
            y: 5
        },
        path: [
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
            [2, 1],
            [2, 2],
            [2, 3],
            [1, 2],
            [0, 2],
            [0, 3],
            [0, 4],
            [0, 5],
            [1, 4],
            [1, 5],
            [3, 2],
            [4, 2],
            [5, 2],
            [5, 1],
            [5, 0],
            [4, 3],
            [4, 4],
            [3, 4],
            [3, 5],
            [4, 4],
            [5, 4],
            [5, 5]
        ]
    }
]