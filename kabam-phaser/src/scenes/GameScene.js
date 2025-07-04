import { Config } from '../config.js';
import Player from '../objects/Player.js';
import Wall from '../objects/Wall.js';
import Projectile from '../objects/Projectile.js';
import Health from '../components/Health.js';
import WaveManager from '../managers/WaveManager.js';
import Enemy from '../enemies/Enemy.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.player = null; this.pillar = null; this.walls = null;
        this.projectiles = null; this.enemies = null; this.waveManager = null;
    }

    create() {
        this.input.on('pointerdown', () => { if (!this.input.mouse.locked) { this.input.mouse.requestPointerLock(); } }, this);
        this.physics.world.setBounds(0, 0, Config.WORLD_WIDTH, Config.WORLD_HEIGHT);

        // Wall Textures
        const wallGraphics = this.make.graphics();
        wallGraphics.fillStyle(0x666666); wallGraphics.fillRect(0, 0, Config.GRID_CELL_SIZE, Config.GRID_CELL_SIZE / 2);
        wallGraphics.generateTexture('wall_horizontal_texture', Config.GRID_CELL_SIZE, Config.GRID_CELL_SIZE / 2);
        wallGraphics.clear();
        wallGraphics.fillStyle(0x888888); wallGraphics.fillRect(0, 0, Config.GRID_CELL_SIZE / 4, Config.GRID_CELL_SIZE);
        wallGraphics.generateTexture('wall_vertical_texture', Config.GRID_CELL_SIZE / 4, Config.GRID_CELL_SIZE);
        wallGraphics.destroy();

        // Other Textures
        const bossGraphics = this.make.graphics(); bossGraphics.fillStyle(0xcc0000, 1); bossGraphics.fillRect(0, 0, 96, 96); bossGraphics.generateTexture('boss_texture', 96, 96); bossGraphics.destroy();
        const bossShotGraphics = this.make.graphics(); bossShotGraphics.fillStyle(0x880000, 1); bossShotGraphics.fillRect(0, 0, 24, 24); bossShotGraphics.generateTexture('boss_shot_texture', 24, 24); bossShotGraphics.destroy();
        const zombieGraphics = this.make.graphics(); zombieGraphics.fillStyle(0x28a745, 1); zombieGraphics.fillRect(8, 0, 16, 32); zombieGraphics.generateTexture('zombie_texture', 32, 32); zombieGraphics.destroy();
        const bulletGraphics = this.make.graphics(); bulletGraphics.fillStyle(0xffff00); bulletGraphics.fillCircle(4, 4, 4); bulletGraphics.generateTexture('bullet_texture', 8, 8); bulletGraphics.destroy();

        const worldCenterX = Config.WORLD_WIDTH / 2; const worldCenterY = Config.WORLD_HEIGHT / 2; this.drawIsometricGrid();

        this.pillar = this.add.sprite(worldCenterX, worldCenterY - 50, null).setOrigin(0.5, 1.0);
        const pillarGraphics = this.make.graphics(); pillarGraphics.fillStyle(0x8d6e63, 1); pillarGraphics.fillRect(0, 0, 40, 120); const pillarTexture = pillarGraphics.generateTexture('pillar_texture', 40, 120); pillarGraphics.destroy();
        this.pillar.setTexture('pillar_texture'); this.physics.add.existing(this.pillar); this.pillar.body.setImmovable(true); this.pillar.body.setSize(40, 20).setOffset(0, 100); this.pillar.setDepth(this.pillar.y);
        this.pillar.health = new Health(200, () => this.pillar.destroy(), this.pillar);
        
        this.walls = this.physics.add.staticGroup({ classType: Wall });
        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.projectiles = this.physics.add.group({ classType: Projectile, runChildUpdate: true });
        
        this.player = new Player(this, worldCenterX, worldCenterY + 100);
        this.waveManager = new WaveManager(this);

        this.physics.add.collider(this.player, this.pillar); this.physics.add.collider(this.player, this.walls);
        this.physics.add.collider(this.enemies, this.walls); this.physics.add.collider(this.enemies, this.pillar); this.physics.add.collider(this.enemies, this.enemies);
        this.physics.add.overlap(this.projectiles, this.pillar, this.handleProjectileCollision, null, this);
        this.physics.add.overlap(this.projectiles, this.walls, this.handleProjectileCollision, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileCollision, null, this);
        this.physics.add.overlap(this.projectiles, this.player, this.handlePlayerProjectileCollision, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08); this.cameras.main.setBounds(0, 0, Config.WORLD_WIDTH, Config.WORLD_HEIGHT); this.cameras.main.setZoom(1.5);
    }
    
    // --- UPDATED: Simplified logic, now relies on objects having a takeDamage method ---
    handleProjectileCollision(projectile, obstacle) {
        if (!obstacle.active || !projectile.active || projectile.owner === obstacle) return;
        
        if (typeof obstacle.takeDamage === 'function') {
            obstacle.takeDamage(projectile.damage);
        }

        if (obstacle.body) {
            const knockbackVector = new Phaser.Math.Vector2(obstacle.x - projectile.x, obstacle.y - projectile.y).normalize();
            obstacle.body.velocity.x += knockbackVector.x * Config.KNOCKBACK_STRENGTH;
            obstacle.body.velocity.y += knockbackVector.y * Config.KNOCKBACK_STRENGTH;
        }
        
        projectile.destroy();
    }
    
    handlePlayerProjectileCollision(player, projectile) { if (!player.active || projectile.owner === player) return; player.takeDamage(projectile.damage); projectile.destroy(); }
    handlePlayerEnemyCollision(player, enemy) { if (!player.active || !enemy.active) return; if (enemy.canAttack()) { player.takeDamage(enemy.stats.damage); enemy.resetAttackTimer(); } }
    update(time, delta) { if (this.player.active) { this.player.update(); } if (this.waveManager) { this.waveManager.update(time, delta); } }
    drawIsometricGrid() { const graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x444444 } }); const halfWidth = Config.GRID_CELL_SIZE / 2; const halfHeight = Config.GRID_CELL_SIZE / 4; for (let i = 0; i < 60; i++) { for (let j = 0; j < 60; j++) { const tx = (i - j) * halfWidth; const ty = (i + j) * halfHeight; graphics.beginPath(); graphics.moveTo(tx, ty + halfHeight); graphics.lineTo(tx + halfWidth, ty); graphics.lineTo(tx, ty - halfHeight); graphics.lineTo(tx - halfWidth, ty); graphics.closePath(); graphics.strokePath(); } } graphics.setPosition(Config.WORLD_WIDTH / 2, Config.WORLD_HEIGHT / 3); }
}