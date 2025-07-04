export default class Health {
    constructor(maxHealth, onDeathCallback, context) {
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.onDeathCallback = onDeathCallback;
        this.context = context; // The game object (e.g., player, enemy)
    }

    takeDamage(amount) {
        if (this.currentHealth <= 0) return;

        this.currentHealth -= amount;
        console.log(`Took ${amount} damage, ${this.currentHealth}/${this.maxHealth} HP remaining.`);

        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            console.log("Health reached zero. Triggering death callback.");
            this.onDeathCallback.call(this.context);
        }
    }
}