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

        // Skip task if reqs not met
        if (game.combat.slayerTask && game.combat.slayerTask.active) {
          let areaData = game.getMonsterArea(game.combat.slayerTask.monster);
          let slayerLevelReq = 0;
          if (areaData instanceof SlayerArea) slayerLevelReq = areaData.slayerLevelRequired;
          if (!game.checkRequirements(areaData.entryRequirements, true, slayerLevelReq)) {
            game.combat.slayerTask.selectTask(game.combat.slayerTask.tier, true, true, true);
          }
        }
      },
      1000
    );
  }
}
