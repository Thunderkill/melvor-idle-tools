class CombatModule {
  load() {
    mvb.addPoller(
      "CombatModule",
      () => {
        if (!settings.autoLoot) return;

        if (game.combat.loot.drops.length >= game.combat.loot.maxLoot) {
          game.combat.loot.lootAll();
        }
      },
      1000
    );
  }
}
