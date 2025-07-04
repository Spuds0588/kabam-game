export default class Weapon {
    constructor(scene, owner, weaponData) {
        this.scene = scene;
        this.owner = owner;
        this.weaponData = weaponData;
        this.currentDurability = weaponData.durability;
        this.lastUsedTimestamp = 0; // For tracking cooldown
    }

    /**
     * Checks if the weapon is ready to be used based on its cooldown.
     * @returns {boolean} True if the weapon can be used, false otherwise.
     */
    canUse() {
        return this.scene.time.now > this.lastUsedTimestamp + this.weaponData.cooldown;
    }

    /**
     * The primary method to activate the weapon.
     * This method is intended to be overridden by specific weapon implementations.
     */
    use(targetX, targetY) {
        throw new Error("Method 'use(targetX, targetY)' must be implemented by subclass.");
    }

    degrade() {
        // Logic for weapon durability loss
    }

    break() {
        // Logic for when a weapon breaks
    }
}