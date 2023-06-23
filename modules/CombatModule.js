class CombatModule {
  load() {
    mvb.addPoller(
      "CombatModule",
      () => {
        if (mvb.settings.autoLoot && game.combat.loot.drops.length >= game.combat.loot.maxLoot) {
          game.combat.loot.lootAll();
        }

        // Jump to correct slayer task
        if (
          mvb.settings.jumpToSlayerTask &&
          game.combat.slayerTask.active &&
          game.combat.selectedMonster._localID !== game.combat.slayerTask.monster._localID
        ) {
          game.combat.slayerTask.jumpToTaskOnClick();
        }
      },
      1000
    );
  }
}
