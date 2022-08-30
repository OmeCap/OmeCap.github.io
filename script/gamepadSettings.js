// This file initialises the blockly gamepad, creates the blockly workspace,
// links the game with the blockly gamepad and starts the game.

/**
 * Initilise the gamepad and define the custom blocks
 */

 Blockly.Gamepad['INPUTS'] = {
    'FORWARD': '0',
    'RIGHT': '1',
    'BACKWARD': '2',
    'LEFT': '3'
}

/**
 * Documentation on defining custom blocks with blockly library:
 * https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks#json_format_versus_javascript_api
 *  
 * Documentation on defining custom blocks using blockly gamepad libaray: 
 * https://paol-imi.github.io/blockly-gamepad/#/blocks?id=block-information
 * 
 */
Blockly.Gamepad.init({
    toolbox,
    blocks: {
        'move': {
            method: 'MOVE',
            json: {
                'message0': 'move forward',
                'previousStatement': null,
                'nextStatement': null,
                'colour': 285
            }
        },
        'collect': {
            method: 'COLLECT',
            json: {
                'message0': 'collect coin',
                'previousStatement': null,
                'nextStatement': null,
                'colour': 285
            }
        },
        'turn': {
            method: 'TURN',
            args: [
                {
                    field: 'DIRECTION',
                    get: parseInt
                }
            ],
            json: {
                'message0': 'turn %1',
                'args0': [
                    {
                        'type': 'field_dropdown',
                        'name': 'DIRECTION',
                        'options': [
                            ['right ↻', Blockly.Gamepad['INPUTS']['RIGHT']],
                            ['left ↺', Blockly.Gamepad['INPUTS']['LEFT']]
                        ]
                    }
                ],
                'previousStatement': null,
                'nextStatement': null,
                'colour': 285
            }
        },
        'repeat_until': {
            method: 'REPEAT',
            statements: ['DO'],
            template: Blockly.Gamepad['TEMPLATES']['WHILE'],
            json: {
                'message0': 'repeat until %1 %2 do %3',
                'args0': [{
                    'type': 'field_image',
                    'src': 'images/destination.png',
                    'width': 15,
                    'height': 15,
                },
                {
                    'type': 'input_dummy'
                },
                {
                    'type': 'input_statement',
                    'name': 'DO'
                }
                ],
                'previousStatement': null,
                'colour': 120,
            }
        },
        'if_path': {
            method: 'PATH',
            args: [
                {
                    field: 'DIRECTION',
                    get: parseInt
                }
            ],
            statements: ['DO'],
            template: Blockly.Gamepad['TEMPLATES']['IF'],
            json: {
                'message0' : 'if path %1 %2 do %3',
                'args0': [
                    {
                        'type': 'field_dropdown',
                        'name': 'DIRECTION',
                        'options': [
                            ['ahead', Blockly.Gamepad['INPUTS']['FORWARD']],
                            ['to the right ↻', Blockly.Gamepad['INPUTS']['RIGHT']],
                            ['to the left ↺', Blockly.Gamepad['INPUTS']['LEFT']]
                        ]
                    },
                    {
                        'type': 'input_dummy'
                    },
                    {
                        'type': 'input_statement',
                        'name': 'DO'
                    }
                ],
                'previousStatement': null,
                'nextStatement': null,
                'colour': 210
            }
        },
        'if_else_path': {
            method: 'PATH',
            args: [
                {
                    field: 'DIRECTION',
                    get: parseInt
                }
            ],
            statements: ['DO', 'ELSE'],
            template: Blockly.Gamepad['TEMPLATES']['IF_ELSE'],
            json: {
                'message0': 'if path %1 %2 do %3 else %4',
                'args0': [
                    {
                        'type': 'field_dropdown',
                        'name': 'DIRECTION',
                        'options': [
                            ['ahead', Blockly.Gamepad['INPUTS']['FORWARD']],
                            ['to the right ↻', Blockly.Gamepad['INPUTS']['RIGHT']],
                            ['to the left ↺', Blockly.Gamepad['INPUTS']['LEFT']]
                        ]
                    },
                    {
                        'type': 'input_dummy'
                    },
                    {
                        'type': 'input_statement',
                        'name': 'DO'
                    },
                    {
                        'type': 'input_statement',
                        'name': 'ELSE'
                    }
                ],
                'previousStatement': null,
                'nextStatement': null,
                'colour': 210
            }
        }
    }
})

/**
 * Create the blockly workspace
 */
var workspace = Blockly.inject('blockly-div', {
    toolbox,
    toolboxPosition: 'start',
    horizontalLayout: false,
})

/**
 * Link the gamepad with the game
 */

const 
    gamepad = new Blockly.Gamepad({
        'start': true,
        'magicJson': true,
        'customHighlight': true
    }),
    gui = new Gui(),
    game = new Game(gui, gamepad);

/**
 * Load the game level
 */
game.loadLevel(levels[id]);