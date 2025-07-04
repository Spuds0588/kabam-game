import { Config } from '../config.js';
import Health from '../components/Health.js';

export default class Wall extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey);
    }
    
    setAimDirection(aimDirection) {
        const isWide = Math.abs(aimDirection.y) > Math.abs(aimDirection.x);
        const textureKey = isWide ? 'wall_horizontal_texture' : 'wall_vertical_texture';
        
        this.setActive(true);
        this.setVisible(true);
        this.setTexture(textureKey);
        this.setBodySize();

        this.setDepth(this.y);
        this.health = new Health(Config.WALL_MAX_HEALTH, this.onDeath, this);
    }

    setBodySize() {
        this.body.setSize(this.width, this.height);
        this.body.setOffset(0, 0);
    }
    
    onDeath() {
        // We use disableBody instead of destroy to allow the group to reuse it.
        this.scene.walls.killAndHide(this);
        this.body.enable = false;
    }

    takeDamage(amount) {
        // --- FIX: This check prevents the crash ---
        if (!this.active || !this.health) return;

        this.health.takeDamage(amount);

        // Only create a tween if the wall is still active after taking damage
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
}