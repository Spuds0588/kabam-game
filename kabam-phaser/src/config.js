import Pistol from './weapons/Pistol.js';
import Zombie from './enemies/Zombie.js';
import BlockBoss from './enemies/BlockBoss.js';

class Toughness {};

export const Config = {
    // Global Settings
    FRIENDLY_FIRE_ENABLED: false,
    GRID_CELL_SIZE: 64, 
    VIEWPORT_WIDTH: 1280, VIEWPORT_HEIGHT: 720,
    WORLD_WIDTH: 2560, WORLD_HEIGHT: 1440,
    PLAYER_SPEED: 200,

    // --- UPDATED: Player Aiming ---
    PLAYER_RETICLE_DISTANCE: 60, // Reduced from 80

    // Wave & Boss Settings
    INTERMISSION_TIME: 30000,
    BASE_WAVE_SIZE: 5,
    BOSS_WAVE_INTERVAL: 3,
    KNOCKBACK_STRENGTH: 500,

    // Player & Wall Settings
    PLAYER_STARTING_MATERIALS: 100,
    PLAYER_MAX_HEALTH: 100,
    WALL_BUILD_COST: 10,
    WALL_BUILD_TIME: 1000,
    WALL_MAX_HEALTH: 50,

    // Enemy Stats
    ENEMY_SPAWN_TABLE: [
        { 
            key: 'zombie', class: Zombie, assetKey: 'zombie_texture', minWave: 1, weight: 100, targetingPreference: 'PLAYER',
            stats: { health: 30, speed: 60, damage: 10 }
        },
    ],
    
    // Boss Data
    BOSS_SPAWN_TABLE: [
        {
            key: 'block_boss', class: BlockBoss, assetKey: 'boss_texture',
            stats: {
                health: 500, speed: 30, damage: 20,
                attack_cooldown: 1500,
                projectile: { assetKey: 'boss_shot_texture', speed: 200, damage: 55 }
            }
        }
    ],

    // Weapon Data
    WEAPON_DATA: {
        'basic_pistol': {
            name: 'Pistol', class: Pistol, assetKey: 'pistol_icon', cooldown: 200,
            projectile: { assetKey: 'bullet_texture', speed: 800, damage: 10, bounces: 0, bounciness: 0.5, type: 'LINEAR' }
        },
    },
    
    // Perk Data
    PERK_TABLE: [
        { key: 'toughness', class: Toughness, name: 'Toughness', description: 'Increases max health by 25.' }
    ]
};