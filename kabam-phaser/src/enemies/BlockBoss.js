import Enemy from './Enemy.js';
import { Config } from '../config.js';

export default class BlockBoss extends Enemy {
    constructor(scene, x, y, assetKey, enemyData) {
        super(scene, x, y, assetKey, enemyData);
    }

    spawn(enemyData, target) {
        super.spawn(enemyData, target); // Call the parent's spawn method
        
        // --- FIX: Make the boss visually larger ---
        this.setScale(3); // 3 times the size of its 96x96 texture
        
        // Update the hitbox to match the new scale
        const newWidth = this.width * 3;
        const newHeight = this.height * 3;
        this.body.setSize(newWidth, newHeight);

        // This is a separate timer for firing projectiles
        this.projectileAttackTimer = this.scene.time.addEvent({
            delay: this.stats.attack_cooldown,
            callback: this.fireProjectile,
            callbackScope: this,
            loop: true
        });
    }

    fireProjectile() {
        if (!this.active || !this.target || !this.target.active) {
            return;
        }

        console.log("Boss is firing projectile!");
        const projectileData = this.stats.projectile;
        const projectile = this.scene.projectiles.get(this.x, this.y, projectileData.assetKey);
        
        if (projectile) {
            projectile.fire(this, this.target.x, this.target.y, projectileData);
        }
    }
    
    onDeath() {
        if (this.projectileAttackTimer) {
            this.projectileAttackTimer.remove();
        }
        super.onDeath();
    }
}