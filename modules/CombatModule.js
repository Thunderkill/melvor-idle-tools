class CombatModule {
  load() {
    mvb.addPoller(
      "CombatModule",
      () => {
        if (mvb.settings.autoLoot && game.combat.loot.drops.length >= game.combat.loot.maxLoot) {
          mvb.log("Looting all");
          game.combat.loot.lootAll();
        }

        // Jump to correct slayer task
        if (
          mvb.settings.jumpToSlayerTask &&
          game.combat.slayerTask.active &&
          game.combat.selectedMonster._localID !== game.combat.slayerTask.monster._localID
        ) {
          mvb.log("Jumping to slayer task");
          game.combat.slayerTask.jumpToTaskOnClick();
        }

        // Skip task if unwanted mob
        if (
          game.combat.slayerTask &&
          game.combat.slayerTask.active &&
          mvb.settings.skipSlayerMonsters.includes(game.combat.slayerTask.monster.name)
        ) {
          mvb.log("Skipping slayer mob as we ignore it");
          game.combat.slayerTask.selectTask(game.combat.slayerTask.tier, true, true, true);
        }
      },
      1000
    );
  }
}
