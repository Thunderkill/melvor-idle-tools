class FarmingModule {
  load() {
    mvb.addPoller(
      "FarmingModule",
      () => {
        if (!mvb.settings.autoFarm) return;

        const compost = game.items.composts.getObjectByID("melvorD:Compost");
        const rake = game.items.equipment.getObjectByID("melvorD:Bobs_Rake");
        const cape = game.items.equipment.getObjectByID("melvorD:Farming_Skillcape");

        const oldCape = game.combat.player.equipment.slots.Cape.item;
        const oldWeapon = game.combat.player.equipment.slots.Weapon.item;
        const oldOffhand = game.combat.player.equipment.slots.Shield.item;
        let changedCape = false;
        let changedWeapon = false;

        // If we are going to do farming stuff then equip the set and do them
        if (game.farming.plots.allObjects.filter((x) => x.level <= game.farming.level).some((x) => x.state !== 2)) {
          if (game.combat.player.equipment.slots.Cape.item !== cape) {
            mvb.log("Equipping Farming skillcape");
            game.combat.player.equipCallback(cape, "Cape", 1);
            changedCape = true;
          }
          if (game.combat.player.equipment.slots.Weapon.item !== rake) {
            mvb.log("Equipping Bob's rake");
            game.combat.player.equipCallback(rake, "Weapon", 1);
            changedWeapon = true;
          }
        }

        game.farming.plots.allObjects.forEach((plot) => {
          switch (plot.state) {
            case 1:
              if (plot.compostLevel != 100) {
                if (!game.bank.hasItem(compost) || game.bank.items.get(compost).quantity < 10) {
                  const purchase = game.shop.getQuickBuyPurchase(compost);
                  const costs = game.shop.getPurchaseCosts(purchase, 10);
                  if (costs.checkIfOwned()) {
                    const oldQuantity = game.shop.buyQuantity;
                    game.shop.buyQuantity = 10;
                    game.shop.buyItemOnClick(purchase, true);
                    game.shop.buyQuantity = oldQuantity;
                    mvb.log("Bought 10 compost for %s", costs.gp);
                  } else {
                    mvb.log("We don't have enough coins to purchase compost!");
                  }
                }
                mvb.log("Trying to compost %s", plot._localID);
                game.farming.compostPlot(plot, compost, Infinity);
              }
              const method = mvb.settings.farmMethod;
              const recipes = game.farming.categoryRecipeMap.get(plot.category);
              const bestRecipe = recipes
                .filter(
                  (recipe) =>
                    recipe.level <= game.farming.level &&
                    game.farming.getOwnedRecipeSeeds(recipe) >= recipe.seedCost.quantity
                )
                .sort((a, b) => {
                  // Highest level first
                  if (method === "best") {
                    return b.level - a.level;
                  }
                  // Lowest mastery level first
                  if (method === "mastery") {
                    const aMastery = game.farming.actionMastery.get(a);
                    const bMastery = game.farming.actionMastery.get(b);
                    return aMastery.xp - bMastery.xp;
                  }
                  return b.level - a.level;
                })[0];
              if (!bestRecipe) return;
              mvb.log("Trying to plant %s on %s (%O) (%O)", bestRecipe._localID, plot._localID, bestRecipe, plot);
              game.farming.plantRecipe(bestRecipe, plot);
              break;
            case 2:
              break;
            case 3:
              mvb.log("Trying harvest %s", plot._localID);
              game.farming.harvestPlot(plot);
              break;
            case 4:
              mvb.log("Trying to clear dead %s", plot._localID);
              game.farming.clearDeadPlot(plot);
              break;
          }
        });

        // Now change back to our old equipment
        if (changedCape) {
          mvb.log("Equipping back %s", oldCape._localID);
          game.combat.player.equipCallback(oldCape, "Cape", 1);
        }

        if (changedWeapon) {
          mvb.log("Equipping back %s", oldCape._localID);
          game.combat.player.equipCallback(oldWeapon, "Weapon", 1);
          if (oldWeapon !== oldOffhand) {
            mvb.log("Equipping back %s", oldCape._localID);
            game.combat.player.equipCallback(oldOffhand, "Shield", 1);
          }
        }
      },
      1000
    );
  }
}
