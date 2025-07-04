export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('PreloaderScene');
    }

    preload() {
        // In a full implementation, this is where we would load all assets
        // defined in config.js.
        // For example:
        // Config.ENEMY_SPAWN_TABLE.forEach(enemy => {
        //     this.load.spritesheet(enemy.assetKey, `assets/enemies/${enemy.assetKey}.png`, { frameWidth: 32, frameHeight: 32 });
        // });
        console.log("Preloading assets... (Skipped for prototype)");
    }

    create() {
        console.log("Preloading complete. Starting game.");
        this.scene.start('GameScene');
        this.scene.launch('UIScene'); // Launch UI in parallel
    }
}