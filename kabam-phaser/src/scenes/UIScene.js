import { Config } from '../config.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: false });
        this.gameScene = null;
        this.healthText = null;
        this.materialsText = null;
        this.waveInfoText = null;
        this.countdownText = null;
        this.announcementTimer = null;
    }

    create() {
        this.gameScene = this.scene.get('GameScene');

        this.add.text(10, 10, 'Kabam v1.0', { font: '18px Arial', fill: '#ffffff' });
        this.healthText = this.add.text(10, 40, '', { font: '24px Arial', fill: '#ff4d4d', stroke: '#000', strokeThickness: 2 });
        this.materialsText = this.add.text(10, 70, '', { font: '20px Arial', fill: '#cccccc', stroke: '#000', strokeThickness: 2 });
        
        const textStyle = { font: '32px Arial', fill: '#ffffff', stroke: '#000000', strokeThickness: 5 };
        this.waveInfoText = this.add.text(Config.VIEWPORT_WIDTH / 2, 50, '', textStyle).setOrigin(0.5).setVisible(false);
        this.countdownText = this.add.text(Config.VIEWPORT_WIDTH / 2, 50, '', textStyle).setOrigin(0.5).setVisible(false);
        
        this.gameScene.events.on('waveUpdate', this.handleWaveUpdate, this);
    }

    showAnnouncement(text, duration = 2000) {
        if (this.announcementTimer) { this.announcementTimer.remove(); }
        this.countdownText.setVisible(false);
        this.waveInfoText.setText(text).setVisible(true);
        this.announcementTimer = this.time.delayedCall(duration, () => {
            this.waveInfoText.setVisible(false);
        });
    }
    
    handleWaveUpdate(state, waveNumber) {
        switch (state) {
            case 'WAVE_START': this.showAnnouncement(`Wave ${waveNumber} Start!`); this.countdownText.setVisible(false); break;
            case 'BOSS_WAVE_START': this.showAnnouncement(`!!! BOSS WAVE ${waveNumber} !!!`, 3000); this.countdownText.setVisible(false); break;
            case 'INTERMISSION_START': if (waveNumber > 0) { this.showAnnouncement(`Wave ${waveNumber} Cleared!`); } break;
        }
    }

    update(time, delta) {
        if (this.gameScene && this.gameScene.player && this.gameScene.player.active) {
            const player = this.gameScene.player;
            this.healthText.setText(`HP: ${player.health.currentHealth} / ${player.health.maxHealth}`);
            this.materialsText.setText(`Materials: ${player.materials}`);
        } else {
            this.healthText.setText('HP: --');
            this.materialsText.setText('Materials: --');
        }

        if (this.gameScene && this.gameScene.waveManager) {
            const waveManager = this.gameScene.waveManager;
            if (waveManager.state === 'INTERMISSION' && !this.waveInfoText.visible) {
                if (waveManager.intermissionTimer) {
                    const remainingTime = Math.ceil(waveManager.intermissionTimer.getRemainingSeconds());
                    this.countdownText.setText(`Next wave in ${remainingTime}...`).setVisible(true);
                }
            } else {
                this.countdownText.setVisible(false);
            }
        }
    }
}