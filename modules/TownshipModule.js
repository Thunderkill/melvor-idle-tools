class TownshipModule {
  load() {
    const resources = [
      game.township.resources.getObjectByID("melvorF:Herbs"),
      game.township.resources.getObjectByID("melvorF:Potions"),
    ];

    mvb.addPoller(
      "TownshipModule",
      () => {
        if (
          game.township.getTotalRepairCosts().size > 0 &&
          game.township.canAffordRepairAllCosts(game.township.getTotalRepairCosts())
        ) {
          mvb.log("Repairing town");
          game.township.repairAllBuildings();
        }

        if (game.township.townData.health < 100) {
          for (const resource of resources) {
            const resourceCost = game.township.getIncreaseHealthCost(resource);
            if (resourceCost > resource.amount) continue;
            mvb.log("Healing town with %s", resource.name);
            game.township.increaseHealth(resource, 1);
            break;
          }
        }
      },
      1000
    );
  }
}
