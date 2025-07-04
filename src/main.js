import { Config } from './config.js';
import PreloaderScene from './scenes/PreloaderScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';

import './weapons/Pistol.js';
import './enemies/Zombie.js';
import './enemies/BlockBoss.js';

const phaserConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: Config.VIEWPORT_WIDTH,
        height: Config.VIEWPORT_HEIGHT,
    },
    parent: 'game-container',
    pixelArt: true,
    input: {
        gamepad: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
            gravity: { y: 0 }
        }
    },
    scene: [
        PreloaderScene,
        GameScene,
        UIScene
    ]
};

const game = new Phaser.Game(phaserConfig);