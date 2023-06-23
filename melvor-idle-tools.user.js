// ==UserScript==
// @name         Melvor Idle
// @namespace    https://github.com/Thunderkill
// @version      0.9.3
// @description  Melvor Idle utilities
// @author       Thunderr
// @match        https://melvoridle.com/index_game.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=melvoridle.com
// @updateURL    https://github.com/Thunderkill/melvor-idle-tools/raw/main/melvor-idle-tools.user.js
// @downloadURL  https://github.com/Thunderkill/melvor-idle-tools/raw/main/melvor-idle-tools.user.js
// @require      https://github.com/Thunderkill/melvor-idle-tools/raw/main/SettingsManager.js
// @require      https://github.com/Thunderkill/melvor-idle-tools/raw/main/Framework.js
// @require      https://github.com/Thunderkill/melvor-idle-tools/raw/main/modules/MasteryModule.js
// @require      https://github.com/Thunderkill/melvor-idle-tools/raw/main/modules/FiremakingModule.js
// @require      https://github.com/Thunderkill/melvor-idle-tools/raw/main/modules/CombatModule.js
// @require      https://github.com/Thunderkill/melvor-idle-tools/raw/main/modules/FarmingModule.js
// @require      https://github.com/Thunderkill/melvor-idle-tools/raw/main/modules/MiningModule.js
// @require      https://github.com/Thunderkill/melvor-idle-tools/raw/main/modules/TownshipModule.js
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  window.mvb = {
    version: 0.3,
    settings: new SettingsManager(),
    log: (...args) => console.log("%c[MVB]: %c%s", "color: #0080ff", "color: #FFF", ...args),
    modules: [
      new MasteryModule(),
      new FiremakingModule(),
      new CombatModule(),
      new FarmingModule(),
      new MiningModule(),
      new TownshipModule(),
    ],
    framework: new Framework(),
    addPoller: (name, callback, interval) => {
      setInterval(callback, interval);
      mvb.log("Added poller %s with a interval of %sms", name, interval);
    },
  };

  mvb.settings.load();
  mvb.framework.start();
})();
