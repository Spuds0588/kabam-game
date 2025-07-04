import Weapon from './Weapon.js';

export default class Pistol extends Weapon {
    constructor(scene, owner, weaponData) {
        super(scene, owner, weaponData);
    }

    use(targetX, targetY) {
        if (!this.canUse()) {
            return; // Weapon is on cooldown
        }

        this.lastUsedTimestamp = this.scene.time.now;
        
        const projectile = this.scene.projectiles.get(this.owner.x, this.owner.y, this.weaponData.projectile.assetKey);

        if (projectile) {
            // --- FIX: Pass the actual owner object, not its coordinates ---
            projectile.fire(this.owner, targetX, targetY, this.weaponData.projectile);
            console.log("Pistol fired!");
        }
    }
}