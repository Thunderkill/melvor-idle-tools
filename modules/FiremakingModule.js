class FiremakingModule {
  start() {
    mvb.pollers.push([
      () => {
        if (!game.firemaking.isActive) {
          return;
        }
        if (mvb.settings.autoBonfire && !game.firemaking.isBonfireActive) {
          mvb.log("Relighting bonfire");
          game.firemaking.lightBonfire();
        }
      },
      1000,
    ]);
  }
}
