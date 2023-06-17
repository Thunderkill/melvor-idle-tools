class FiremakingModule {
  load() {
    mvb.addPoller(
      "FiremakingModule",
      () => {
        if (!game.firemaking.isActive) {
          return;
        }
        if (mvb.settings.autoBonfire && !game.firemaking.isBonfireActive) {
          mvb.log("Relighting bonfire");
          game.firemaking.lightBonfire();
        }
      },
      1000
    );
  }
}
