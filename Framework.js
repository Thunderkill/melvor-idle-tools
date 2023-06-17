class Framework {
  start() {
    this.inject();
  }

  inject() {
    if (!game || !game.loopStarted) {
      setTimeout(this.inject, 500);
      return;
    }

    for (let module of mvb.modules) {
      module.load();
    }

    mvb.log("Bot injected");
  }
}
