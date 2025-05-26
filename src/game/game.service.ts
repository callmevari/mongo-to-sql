export class GameService {
  private counter = 0;
  private pool: (() => void)[] = [];

  constructor() {
    this.resetPool();
  }

  trackQuery() {
    this.counter++;
    if (this.counter >= 3) {
      this.counter = 0;
      this.triggerFun();
    }
  }

  private triggerFun() {
    if (this.pool.length === 0) {
      this.resetPool();
    }

    const next = this.pool.shift();
    next?.();
  }

  private resetPool() {
    this.pool = [
      () => {
        console.log("\n🃏 Joke:");
        console.log("Why did the developer go broke?");
        console.log("Because he used up all his cache.");
      },
      () => {
        console.log("\n🧩 Riddle:");
        console.log("What has keys but can't open locks?");
        console.log("\n...\n...\n");
        console.log("A piano.");
      },
      () => {
        console.log("\n💡 Inspiration:");
        console.log(
          "Code is like humor. When you have to explain it, it’s bad."
        );
      },
      () => {
        console.log("\n👅 Tongue-twister:");
        console.log("She sells sea shells by the seashore.");
      },
      () => {
        console.log("\n🤯 Fun Fact:");
        console.log("Octopuses have three hearts and blue blood.");
      },
    ];
    this.pool.sort(() => Math.random() - 0.5);
  }
}
