export default class Perk {
    constructor(player, perkData) {
        this.player = player;
        this.perkData = perkData;
    }
    
    /** Called once when the perk is added to a player. */
    apply() {}

    /** Called every frame. */
    update() {}

    // Other hook methods as needed (onDamageDealt, etc.)
}