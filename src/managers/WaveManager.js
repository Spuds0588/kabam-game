import { Config } from '../config.js';

export default class WaveManager {
    constructor(scene) {
        this.scene = scene;
        this.currentWave = 0;
        this.state = 'INTERMISSION';
        this.enemiesToSpawn = 0;
        this.enemiesAlive = 0;
        this.spawnTimer = null;
        this.intermissionTimer = null;

        this.startIntermission();
    }

    startIntermission() {
        this.state = 'INTERMISSION';
        console.log(`--- INTERMISSION STARTED (${Config.INTERMISSION_TIME / 1000}s) ---`);
        this.scene.events.emit('waveUpdate', 'INTERMISSION_START', this.currentWave);

        const nextWave = this.currentWave + 1;
        if (nextWave > 0 && nextWave % Config.BOSS_WAVE_INTERVAL === 0) {
            this.intermissionTimer = this.scene.time.addEvent({ delay: Config.INTERMISSION_TIME, callback: this.startBossWave, callbackScope: this });
        } else {
            this.intermissionTimer = this.scene.time.addEvent({ delay: Config.INTERMISSION_TIME, callback: this.startNextWave, callbackScope: this });
        }
    }

    startNextWave() {
        if (this.intermissionTimer) this.intermissionTimer.remove();
        this.currentWave++;
        this.state = 'WAVE';
        console.log(`>>> WAVE ${this.currentWave} STARTED <<<`);
        this.scene.events.emit('waveUpdate', 'WAVE_START', this.currentWave);

        this.enemiesToSpawn = Config.BASE_WAVE_SIZE + (this.currentWave * 2);
        this.enemiesAlive = 0;
        this.spawnTimer = this.scene.time.addEvent({ delay: 800, callback: this.spawnWaveEnemy, callbackScope: this, loop: true });
    }
    
    startBossWave() {
        if (this.intermissionTimer) this.intermissionTimer.remove();
        this.currentWave++;
        this.state = 'BOSS';
        console.log(`>>> BOSS WAVE ${this.currentWave} STARTED <<<`);
        this.scene.events.emit('waveUpdate', 'BOSS_WAVE_START', this.currentWave);
        
        this.enemiesToSpawn = 1;
        this.enemiesAlive = 1;
        this.spawnBoss();
    }

    spawnWaveEnemy() {
        if (this.enemiesToSpawn <= 0) {
            if (this.spawnTimer) this.spawnTimer.remove();
            return;
        }
        this.spawnEnemy('zombie');
        this.enemiesToSpawn--;
        this.enemiesAlive++;
    }

    onEnemyKilled() {
        this.enemiesAlive--;
        console.log(`Enemy killed. Remaining alive: ${this.enemiesAlive}`);
        if (this.enemiesToSpawn <= 0 && this.enemiesAlive <= 0) {
            if (this.state === 'WAVE') console.log(`Wave ${this.currentWave} cleared!`);
            if (this.state === 'BOSS') console.log(`Boss on wave ${this.currentWave} defeated!`);
            this.startIntermission();
        }
    }
    
    // --- FIX: Instantiates the correct enemy class ---
    spawnEnemy(key) {
        const enemyData = Config.ENEMY_SPAWN_TABLE.find(e => e.key === key);
        if (!enemyData) return;
        const spawnPoint = this.getOffscreenSpawnPoint();
        const enemy = new enemyData.class(this.scene, spawnPoint.x, spawnPoint.y, enemyData.assetKey, enemyData);
        this.scene.enemies.add(enemy, true);
        enemy.spawn(enemyData, this.scene.player);
    }
    
    // --- FIX: Instantiates the correct boss class ---
    spawnBoss() {
        const bossData = Config.BOSS_SPAWN_TABLE.find(e => e.key === 'block_boss');
        if (!bossData) return;
        const spawnPoint = this.getOffscreenSpawnPoint();
        const boss = new bossData.class(this.scene, spawnPoint.x, spawnPoint.y, bossData.assetKey, bossData);
        this.scene.enemies.add(boss, true);
        boss.spawn(bossData, this.scene.player);
    }
    
    getOffscreenSpawnPoint() {
        const worldBounds = this.scene.physics.world.bounds;
        const spawnPoints = [
            { x: Phaser.Math.Between(worldBounds.left, worldBounds.right), y: worldBounds.top - 50 },
            { x: Phaser.Math.Between(worldBounds.left, worldBounds.right), y: worldBounds.bottom + 50 },
            { x: worldBounds.left - 50, y: Phaser.Math.Between(worldBounds.top, worldBounds.bottom) },
            { x: worldBounds.right + 50, y: Phaser.Math.Between(worldBounds.top, worldBounds.bottom) }
        ];
        return Phaser.Utils.Array.GetRandom(spawnPoints);
    }

    update(time, delta) {}
}