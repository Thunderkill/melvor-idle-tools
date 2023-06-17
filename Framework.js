class Framework {
  start() {
    mvb.log("Starting inject loop");
    this.inject();
  }

  tries = 0;

  inject() {
    console.log("asd");
    if (!game || !game.loopStarted) {
      this.tries++;
      if (this.tries % 10 === 0) {
        mvb.log("Waiting for game to start....");
      }
      setTimeout(this.inject, 500);
      return;
    }

    for (let module of mvb.modules) {
      module.load();
    }

    mvb.log("Bot injected");
  }
}
