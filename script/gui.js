class Gui {
    constructor() {
        this.asynchronizer = new Blockly.Gamepad.Asynchronizer(
            GUI,
            function(id) {
                // get the coordinates of rect and car
                this.rect = document.getElementById('clipRect' + id);
                this.car = document.getElementById('car' + id);

                this.rect.setAttribute('x', guiData.start[id - 1].rect.x);
                this.rect.setAttribute('y', guiData.start[id - 1].rect.y);
                this.car.setAttribute('x', guiData.start[id - 1].car.x);
                this.car.setAttribute('y', guiData.start[id - 1].car.y);
            },
            function () {
            // reset function
            }
        );
    }

    /**
     * Load the game map and coins
     * @param {number} id 
     */
    load(id) {
        if(id) {
            this.id = id;
        }
        this.asynchronizer.reset();
        this.asynchronizer.run(this.id);

        // show/hide the game map
        document.getElementById("1").style.display = this.id == 1 ? 'block' : 'none';
        document.getElementById("2").style.display = this.id == 2 ? 'block' : 'none';
        document.getElementById("3").style.display = this.id == 3 ? 'block' : 'none';
        document.getElementById("coin1").style.display = this.id == 3 ? 'block' : 'none';
        document.getElementById("coin2").style.display = this.id == 3 ? 'block' : 'none';
        document.getElementById("coinNumber").style.display = this.id == 3 ? 'block' : 'none';
        document.getElementById("4").style.display = this.id == 4 ? 'block' : 'none';
        document.getElementById("5").style.display = this.id == 5 ? 'block' : 'none';

        // reset the coin count on load
        document.getElementById('currentCoinNumber').innerHTML = 0;
    };

    /**
     * Manage the request
     * @param {object} request 
     * @param {boolean} back indicator for the method 'backward'
     */
    manageRequest(request, back) {
        let currentInstance = this.asynchronizer.async;

        if(['TURN', 'MOVE', 'COLLECT'].includes(request.method)) {
            return currentInstance[request.method].apply(currentInstance, [back].concat(request.data))
        } else {
            return currentInstance.someTime(true)
        }
    }
}

class GUI {
    constructor() {
        this.animate = true;
    }

    someTime(lotOfTime) {
        return new Promise(resolve => {
            setTimeout(resolve, this.animate ? lotOfTime ? guiData.lotOfTime : guiData.time : 0);
        })
    };

    // Method for a small turn (rotate the car 22.5 degree angle)

    /**
     * Method for a small turn (rotate the car 22.5 degree angle)
     * @param {boolean} clockwise 
     */
    turn(clockwise) {
        let off = guiData.rotateOff * (clockwise ? -1 : 1),
            val = parseInt(this.rect.getAttribute('x')),
            x = parseInt(this.car.getAttribute('x')) + off;
        
        if (x > val) {
            x = val - guiData.max;
        } else if (x < val - guiData.max) {
            x = val;
        }

        this.car.setAttribute('x', x);
    }

    /**
     * Method of small move (move 10px)
     * @param {boolean} forward 
     * @param {number} direction 
     * @param {boolean} slap 
     */
    move(forward, direction, slap) {
        let off = guiData.moveOff * (forward ? 1 : -1) * (slap ? 0.4 : 1),
            xP = parseInt(this.car.getAttribute('x')),
            yP = parseInt(this.car.getAttribute('y')),
            xR = parseInt(this.rect.getAttribute('x')),
            yR = parseInt(this.rect.getAttribute('y')),
            position = [{
                // Up
                x: 0,
                y: -off
            },
            {
                // Right
                x: off,
                y: 0
            },
            {
                // Down 
                x: 0,
                y: off
            },
            {
                // Left
                x: -off,
                y: 0
            }
            ][direction]
        
        // update the coordinates for car and rect
        this.car.setAttribute('x', position.x + xP);
        this.car.setAttribute('y', position.y + yP);
        this.rect.setAttribute('x', position.x + xR);
        this.rect.setAttribute('y', position.y + yR);
    }

    /**
     * Move animation, each move is consisted of 5 small moves (title size = 50px)
     * @param {boolean} back 
     * @param {boolean} hasMoved 
     * @param {number} direction
     */
    MOVE(back, hasMoved, direction) {
        return new Promise(async resolve => {
            // if the car has not moved, show the crash animation
            if(hasMoved) {
                // move animation
                for (let i = 0; i < guiData.moveFrames; i++) {
                    this.move(!back, direction);
                    await this.someTime();
                }
            } else {
                // crush animation
                this.move(!back, direction, true);

                await this.someTime();

                this.move(back, direction, true);

                await this.someTime();
            }
            resolve();
        })
    };

    /**
     * Rotate the car 90 degree angle clockwise/anti-clockwise
     * A 90 degree angle turn action is consisted of 4 small turns
     * each small turn rotates the car 22.5 degree angle
     * @param {boolean} back 
     * @param {boolean} clockwise 
     */
    TURN(back, clockwise) {
        return new Promise(async resolve => {
            for (let i = 0; i < guiData.rotateFrames; i++) {
                this.turn(back ? !clockwise : clockwise);

                await this.someTime();
            }
            resolve();
        })
    }

    /**
     * Collect the coin; Hide the coin if there is one, and reveal the coin 
     * for the backward method.
     * @param {boolean} back 
     * @param {boolean} isCoin 
     */
    COLLECT(back, isCoin, currentNumber, coinIndex) {
        return new Promise(async resolve => {
            if(back) {
                document.getElementById('coin' + (coinIndex + 1)).style.display = back ? 'block' : 'none';
                document.getElementById('currentCoinNumber').innerHTML = currentNumber - 1;
            } else if(!back && isCoin) {
                document.getElementById('coin' + (coinIndex + 1)).style.display = 'none';
                document.getElementById('currentCoinNumber').innerHTML = currentNumber;
                await this.someTime();
                await this.someTime();
            }
            resolve();
        })
    }
}


/**
 * Paramters used in the above methods
 */
const guiData = {
    // animation frame time
    time: 100,
    // time to wait
    lotOfTime: 350,
    // user click max time offset
    clickTime: 350,
    // single frame move offset
    moveOff: 10, // the tile size is 50, each time move 10
    // move frames
    moveFrames: 5, // the tile size is 50, move 5 times
    // single frame rotate offset
    rotateOff: 49, // the car image contains 21 images of car facing different directions, each of them has 49px width
    // rotate frames
    rotateFrames: 4, // shift 4 images to complete a turn of 90 degree
    // max length
    max: 735, // only a maximum of 15 images for turning, each image of 49px width
    // sprite viewports on start
    start: [{
        car: {
            x: -95,
            y: 191
        },
        rect: {
            x: 101,
            y: 191
        }
    },
    {
        car: {
            x: -170,
            y: 188
        },
        rect: {
            x: 30,
            y: 188
        }
    },
    {
        car: {
            x: -149,
            y: 291
        },
        rect: {
            x: 51,
            y: 291
        }
    },
    {
        car: {
            x: 49,
            y: 290
        },
        rect: {
            x: 50,
            y: 290
        }
    },
    {
        car: {
            x: -149,
            y: 291
        },
        rect: {
            x: 51,
            y: 291
        }
    }
    ]
}