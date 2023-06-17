class MiningModule {
  start() {
    mvb.pollers.push([
      () => {
        if (!game.mining.isActive) {
          return;
        }

        if (!mvb.settings.oreSwitch) return;

        let bestRock = game.mining.actions.allObjects
          .filter(
            (x) =>
              x.level <= game.mining.level &&
              (!x.shopItemPurchased || game.shop.isUpgradePurchased(x.shopItemPurchased))
          )
          .filter((x) => !x.isRespawning)
          .filter((x) => x.currentHP > 0)
          .sort((a, b) => b.level - a.level)[0];

        if (bestRock) {
          if (game.mining.activeRock.localID !== bestRock.localID) {
            mvb.log("Changing to %s as it's better", bestRock.localID);
            game.mining.onRockClick(bestRock);
          }
        }
      },
      1000,
    ]);
  }
}
