class Framework {
  start() {
    this.inject();
  }

  inject() {
    if (!game || !game.loopStarted) {
      setTimeout(this.inject, 500);
      return;
    }

    for (let poller of mvb.pollers) {
      setInterval(...poller);
    }

    mvb.log("Bot injected");
  }
}
