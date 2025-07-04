import { Config } from '../config.js';
import Pistol from '../weapons/Pistol.js';
import Health from '../components/Health.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, null);
        
        const playerGraphics = scene.make.graphics(); playerGraphics.fillStyle(0x0000ff, 1); playerGraphics.fillRect(8, 0, 16, 32); playerGraphics.fillStyle(0x00aaff, 1); playerGraphics.fillEllipse(16, 32, 32, 16); const playerTexture = playerGraphics.generateTexture('player_placeholder', 32, 48); playerGraphics.destroy(); this.setTexture('player_placeholder');
        
        this.materials = Config.PLAYER_STARTING_MATERIALS; this.isBuilding = false; this.buildTimer = null;
        this.equippedWeapon = new Pistol(scene, this, Config.WEAPON_DATA['basic_pistol']);
        this.health = new Health(Config.PLAYER_MAX_HEALTH, this.onDeath, this);

        this.aimDirection = new Phaser.Math.Vector2(0, 1);
        this.aimingCone = scene.add.graphics().setVisible(false);

        scene.add.existing(this); scene.physics.add.existing(this);
        this.setCollideWorldBounds(true); this.body.setSize(20, 15).setOffset(6, 33);
        this.setOrigin(0.5, 0.9);

        this.gamepad = null;
        this.keys = scene.input.keyboard.addKeys({ up: 'W', down: 'S', left: 'A', right: 'D', build: 'E' });
        this.initInput();
        this.buildPreview = scene.add.sprite(0, 0, null).setAlpha(0.5).setVisible(false);
        this.buildProgressBar = scene.add.graphics().setVisible(false);
    }

    initInput() {
        this.scene.input.gamepad.once('connected', (pad) => { console.log('Gamepad connected:', pad.id); this.gamepad = pad; this.aimingCone.setVisible(true); });
        this.scene.input.on('pointermove', (pointer) => {
            if (this.gamepad) return; if (this.scene.input.mouse.locked) {
                this.aimDirection.x += pointer.movementX * 0.01; this.aimDirection.y += pointer.movementY * 0.01;
                this.aimDirection.normalize(); this.aimingCone.setVisible(true);
            }
        });
    }

    update() { if (!this.active) { this.body.setVelocity(0); return; } this.handleInput(); this.updateAimingCone(); this.setDepth(this.y); }
    
    handleInput() {
        let moveX=0, moveY=0, aimX=0, aimY=0, isAttacking=false, isBuilding=false; const deadZone=0.2;
        if (this.gamepad) {
            moveX = this.gamepad.leftStick.x; moveY = this.gamepad.leftStick.y;
            aimX = this.gamepad.rightStick.x; aimY = this.gamepad.rightStick.y;
            isAttacking = this.gamepad.buttons[7].value > 0.5; isBuilding = this.gamepad.buttons[0].pressed;
        } else {
            if(this.keys.left.isDown)moveX=-1;else if(this.keys.right.isDown)moveX=1; if(this.keys.up.isDown)moveY=-1;else if(this.keys.down.isDown)moveY=1;
            isAttacking = this.scene.input.activePointer.isDown; isBuilding = this.keys.build.isDown;
        }
        this.body.setVelocity(moveX*Config.PLAYER_SPEED, moveY*Config.PLAYER_SPEED); this.body.velocity.normalize().scale(Config.PLAYER_SPEED);
        const isMoving = this.body.velocity.length() > 0;
        if (Math.abs(aimX) > deadZone || Math.abs(aimY) > deadZone) { this.aimDirection.set(aimX, aimY).normalize(); }
        if (isAttacking) this.handleAttack(); this.handleBuilding(isBuilding, isMoving);
    }
    
    handleAttack() { if (this.isBuilding || !this.active) return; const targetX = this.x + this.aimDirection.x * 100; const targetY = this.y + this.aimDirection.y * 100; this.equippedWeapon.use(targetX, targetY); }
    handleBuilding(isBuildingKeyDown, isMoving) { if (this.isBuilding) { if (!isBuildingKeyDown || isMoving) { this.cancelBuilding(); } else { this.updateProgressBar(); } } else { if (isBuildingKeyDown && !isMoving && this.materials >= Config.WALL_BUILD_COST) { this.updateBuildPreviewPosition(); this.startBuilding(); } } }
    
    updateBuildPreviewPosition() {
        // FIX: Flipped logic for correct perspective
        const isWide = Math.abs(this.aimDirection.y) > Math.abs(this.aimDirection.x);
        const textureKey = isWide ? 'wall_horizontal_texture' : 'wall_vertical_texture';
        this.buildPreview.setTexture(textureKey);

        const previewX = this.x + this.aimDirection.x * Config.GRID_CELL_SIZE;
        const previewY = this.y + this.aimDirection.y * Config.GRID_CELL_SIZE;
        this.buildPreview.setPosition(previewX, previewY).setDepth(previewY);
    }

    startBuilding() { if (this.isBuilding) return; this.isBuilding = true; this.buildPreview.setVisible(true).setAlpha(0.75).setTint(0xffff00); console.log("Starting build..."); this.buildTimer = this.scene.time.addEvent({ delay: Config.WALL_BUILD_TIME, callback: this.finishBuilding, callbackScope: this }); }
    cancelBuilding() { if (this.buildTimer) { this.buildTimer.remove(false); } this.isBuilding = false; this.buildPreview.setVisible(false).clearTint(); this.buildProgressBar.setVisible(false).clear(); console.log("Build cancelled."); }
    
    finishBuilding() {
        if (!this.isBuilding) return;
        this.materials -= Config.WALL_BUILD_COST;
        this.isBuilding = false;
        this.buildPreview.setVisible(false).clearTint(); this.buildProgressBar.setVisible(false).clear();
        
        // --- FIX: This now correctly gets a wall and calls its setup method ---
        const wall = this.scene.walls.get(this.buildPreview.x, this.buildPreview.y);
        if (wall) {
            wall.setAimDirection(this.aimDirection);
        }

        console.log(`Wall built. Materials left: ${this.materials}`);
    }

    onDeath() { console.log("PLAYER HAS DIED."); if (this.isBuilding) { this.cancelBuilding(); } this.aimingCone.setVisible(false); this.setActive(false); this.setVisible(false); }
    takeDamage(amount) { if(!this.health)return; this.health.takeDamage(amount); }
    updateAimingCone() { this.aimingCone.clear(); this.aimingCone.fillStyle(0xffffff, 0.2); const angle = this.aimDirection.angle(); const startAngle = angle - Math.PI / 8; const endAngle = angle + Math.PI / 8; this.aimingCone.slice(this.x, this.y, Config.PLAYER_RETICLE_DISTANCE, startAngle, endAngle); this.aimingCone.fillPath(); this.aimingCone.setDepth(this.y + 1); }
    updateProgressBar() { const progress = this.buildTimer.getProgress(); this.buildProgressBar.clear(); this.buildProgressBar.setVisible(true); this.buildProgressBar.setPosition(this.x - 25, this.y - 50); this.buildProgressBar.fillStyle(0x000000, 0.8); this.buildProgressBar.fillRect(0, 0, 50, 8); this.buildProgressBar.fillStyle(0xffff00, 1); this.buildProgressBar.fillRect(0, 0, 50 * progress, 8); }
}