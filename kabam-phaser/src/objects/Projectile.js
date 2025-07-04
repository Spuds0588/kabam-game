export default class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, assetKey) {
        super(scene, x, y, assetKey);
        this.damage = 0;
        this.owner = null; // NEW
    }
    
    fire(owner, targetX, targetY, projectileData) {
        this.owner = owner; // NEW
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(owner.x, owner.y);
        this.setDepth(owner.y);
        this.damage = projectileData.damage;

        const direction = new Phaser.Math.Vector2(targetX - owner.x, targetY - owner.y).normalize();
        this.setVelocity(direction.x * projectileData.speed, direction.y * projectileData.speed);
        
        // Bounciness is not a property of the body directly
        if(projectileData.bounces !== undefined) {
             this.body.setBounce(projectileData.bounciness, projectileData.bounciness);
        }
    }

    update() {
        this.setDepth(this.y);
        if (!Phaser.Geom.Rectangle.Overlaps(this.scene.physics.world.bounds, this.getBounds())) {
            this.destroy();
        }
    }
}