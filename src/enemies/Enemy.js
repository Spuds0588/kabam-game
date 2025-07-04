import Health from '../components/Health.js';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, assetKey, enemyData) {
        super(scene, x, y, assetKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 0.8);

        this.stats = null;
        this.health = null;
        this.target = null;
        this.attackTimer = 0;
    }
    
    spawn(enemyData, target) {
        this.stats = enemyData.stats;
        this.target = target;
        this.setActive(true);
        this.setVisible(true);
        this.body.enable = true;
        this.health = new Health(this.stats.health, this.onDeath, this);
    }
    
    onDeath() {
        console.log(`${this.constructor.name} has died.`);
        if (this.scene.waveManager) {
            this.scene.waveManager.onEnemyKilled();
        }
        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;
    }

    // --- NEW: Custom damage handler for flashing effect ---
    takeDamage(amount) {
        if (!this.active || !this.health) return;

        this.health.takeDamage(amount);
        
        if (this.active) {
            this.scene.tweens.add({
                targets: this,
                alpha: 0.5,
                duration: 80,
                yoyo: true,
                ease: 'Power1',
                onStart: () => this.setTint(0xffffff),
                onComplete: () => this.clearTint()
            });
        }
    }

    canAttack() { return this.scene.time.now > this.attackTimer; }
    resetAttackTimer() { this.attackTimer = this.scene.time.now + 1000; }

    update() {
        if (!this.active || !this.target || !this.target.active) {
            this.setVelocity(0, 0);
            return;
        }
        this.setDepth(this.y);
        this.scene.physics.moveToObject(this, this.target, this.stats.speed);
    }
}