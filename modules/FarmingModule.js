class FarmingModule {
  start() {
    mvb.pollers.push([
      () => {
        if (!mvb.settings.autoFarm) return;

        const compost = game.items.composts.getObjectByID("melvorD:Compost");

        game.farming.plots.allObjects.forEach((plot) => {
          switch (plot.state) {
            case 1:
              if (plot.compostLevel != 100 && game.bank.hasItem(compost)) {
                mvb.log("Trying to compost %s", plot._localID);
                game.farming.compostPlot(plot, compost, Infinity);
              }
              const recipes = game.farming.categoryRecipeMap.get(plot.category);
              const bestRecipe = recipes
                .filter(
                  (recipe) =>
                    recipe.level <= game.farming.level &&
                    game.farming.getOwnedRecipeSeeds(recipe) >= recipe.seedCost.quantity
                )
                .sort((a, b) => b.level - a.level)[0];
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
      },
      1000,
    ]);
  }
}
