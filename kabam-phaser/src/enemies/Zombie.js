import Enemy from './Enemy.js';

export default class Zombie extends Enemy {
    constructor(scene, x, y, assetKey, enemyData) {
        super(scene, x, y, assetKey, enemyData);
        // This is where unique Zombie logic would go in the future.
    }
}