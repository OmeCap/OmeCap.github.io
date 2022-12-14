class Game {
    constructor(gui, gamepad) {
        // link the game
        gamepad.setGame(this, this.manageRequest);

        this.gamepad = gamepad;
        this.gui = gui;
    };

    /**
     * Handle requests
     * @param {object} request 
     * @param {boolean} back true for backward, false for forward
     * @param {boolean} old true for old, false for new
     */
    manageRequest(request, back, old) {
        let result, promise;

        // update the game when a method is called and the request is not old
        if (['PATH', 'REPEAT', 'TURN', 'MOVE', 'COLLECT'].includes(request.method) && !old) {
            result = this[request.method].apply(this, [].concat(request.args, request));
        }

        // check the game status
        this.checkGameStatus(request, back, old);

        // update the gui
        promise = this.gui.manageRequest(request, back);
        return promise.then(() => result)
    };

    /**
     * Load the game infomation stored in the level object
     * @param {object} level 
     */
    loadLevel(level) {
        if ('maxBlocks' in level) {
            // case when the maxBlocks is set and the start block is used
            Blockly.getMainWorkspace().options.maxBlocks = level.maxBlocks + 1;
        } else {
            // case when the maxBlocks is not set
            Blockly.getMainWorkspace().options.maxBlocks = Infinity;
        }

        if ('blocks' in level) {
            // update the toolbox when the blocks is set in level
            this.gamepad.setToolbox({
                blocks: level.blocks
            });
        } else {
            // display all the blocks
            this.gamepad.setToolbox({
                all: true
            });
        }

        

        // update
        this.gamepad.level = level.game;
        this.id = level.id;

        // load the gui
        this.gui.load(this.id);
        this.gamepad.reset();
        // restore the old code from local storage
        this.gamepad.restore('' + this.id + true);
    };

    /**
     * Load the code generated by the blocks
     */
    loadCode() {
        // load the code
        this.gamepad.load();

        // save the code in local storage
        this.gamepad.save('' + this.id + true);

        // reset the gui
        this.gui.load();

        // load first 'START' request
        this.gamepad.forward();
    };

    /**
     * Check game status, output the game result and log the request info
     * @param {object} request 
     * @param {boolean} back true for backward, false for forward
     * @param {boolean} old true for old, false for new
     */
    checkGameStatus(request, back, old) {
        let car = this.gamepad.level.car,
            destination = this.gamepad.level.destination;
        
        if('coin' in this.gamepad.level) {
            let coin = this.gamepad.level.coin;
            if(request.method == Blockly.Gamepad['STATES']['FINISHED'] && !back) {
                if (car.x == destination.x && car.y == destination.y && coin.totalNumber == coin.currentNumber) {
                    alert('Congratulations, you won!');
                } else if(car.x == destination.x && car.y == destination.y) {
                    alert('You need to collect all the coins! Try again.')
                } else {
                    alert('You lost. Try again!');
                }
            }
        } else {
            // display win/lose alert when the game is finished
            if(request.method == Blockly.Gamepad['STATES']['FINISHED'] && !back) {
                if (car.x == destination.x && car.y == destination.y) {
                    alert('Congratulations, you won!');
                } else {
                    alert('You lost. Try again!');
                }
            }
        }

        
        

        // log request info
        console.group();
            console.info('request:      ', request);
            console.info('request type: ', back ? 'backward' : 'forward');
            console.info('request age:  ', old ? 'old' : 'new');
            console.info('car:          ', JSON.parse(JSON.stringify(car)));
        console.groupEnd();
    };

    /**
     * Get the next position from a given direction.
     * @param {*} direction 
     */
    getNextPosition(direction) {
        return [
            {
                // Up
                x: 0,
                y: 1
            },
            {
                // Right
                x: 1,
                y: 0
            },
            {
                // Down
                x: 0,
                y: -1
            },
            {
                // Left
                x: -1,
                y: 0
            }
        ][direction]
    };

    /**
     * Check if the car can update its position
     * @param {array} path the path available in the game
     * @param {object} car the coordinate of the car
     * @param {object} position 
     */
    canMove(path, car, position) {
        let x = car.x + position.x,
            y = car.y + position.y;

        return path.find(element => element[0] == x && element[1] == y) != undefined
    };
    
    /**
     * Check if there is a coin in the car's current position
     * @param {object} coinPosition
     * @param {object} car 
     */
    isCoin(coinPosition, car) {
        // return coin.x == car.x && coin.y == car.y;
        return coinPosition.find(element => element[0] == car.x && element[1] == car.y) != undefined        
    }

    /**
     * Get the index of the coin
     * @param {object} coinPosition 
     * @param {object} car 
     */
    coinIndex(coinPosition, car) {
        return coinPosition.findIndex(position => JSON.stringify(position) === JSON.stringify([car.x, car.y]))
    }

    /**
     * Update the coin position when a coin is being collected
     * @param {object} coinPosition 
     * @param {object} car 
     */
    updateCoinPosition(coinPosition, car) {
        let coinIndex = this.coinIndex(coinPosition, car);
        if (coinIndex > -1) {
            // if a coin is collected, then update its coordinates
            coinPosition[coinIndex] = [-99, -99];
        } 
        return coinPosition
    }

    // Methods for the custom blocks

    /**
     * Method for custom block - 'move forward'
     * Move the car and update is coordiantes
     * @param {object} request 
     */
    MOVE(request) {
        let path = this.gamepad.level.path,
            car = this.gamepad.level.car,
            position = this.getNextPosition(car.direction),
            canMove = this.canMove(path, car, position);
        
        // if the car can move, then the position is updated
        if(canMove) {
            car.x += position.x;
            car.y += position.y;
        }

        // request data which will be used in gui
        request.data = [canMove, car.direction];
    };

    /**
     * Method for custom block - 'turn left/right'
     * Turn the car and update its direction
     * @param {number} direction 
     * @param {object} request 
     */
    TURN(direction, request) {
        this.gamepad.level.car.direction += direction;
        this.gamepad.level.car.direction %= 4;

        // request data which will be used in gui
        // check if it is truning clockwise
        // ('FORWARD': '0',
        // 'RIGHT': '1',
        // 'BACKWARD': '2',
        // 'LEFT': '3')
        request.data = [direction == 1];
    };

    /**
     * Method for custom block - 'repeat until'
     * @returns {object} Check if the final position is at the destination
     */
    REPEAT() {
        let car = this.gamepad.level.car,
            destination = this.gamepad.level.destination;

        return {
            return: car.x != destination.x || car.y != destination.y
        }
    };

    /**
     * Method for custom block - 'if(-else) path'
     * @param {number} direction 
     * @returns {object} Check if the car is able to move
     */
    PATH(direction) {
        let path = this.gamepad.level.path,
            car = this.gamepad.level.car,
            position = this.getNextPosition((car.direction + direction) % 4);

            return {
                return: this.canMove(path, car, position)
            }
    };

    /**
     * Method for custom block - 'collect coin'
     * @param {object} request 
     */
    COLLECT(request) {
        let car = this.gamepad.level.car,
            coin = this.gamepad.level.coin,
            coinPosition = this.gamepad.level.coin.coinPosition,
            isCoin = this.isCoin(coinPosition, car),
            coinIndex;
        if(isCoin) {
            coinIndex = this.coinIndex(coinPosition, car);
            this.gamepad.level.coin.coinPosition = this.updateCoinPosition(coinPosition, car);
            coin.currentNumber += 1;
        } else {
            alert('There is no coin here!')
        }
        request.data = [isCoin, coin.currentNumber, coinIndex];
    }
}