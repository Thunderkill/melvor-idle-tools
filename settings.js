class SettingsManager {
  settings = {
    autoBonfire: true,
    autoLoot: true,
    oreSwitch: false,
    autoFarm: true,
    version: 0,
  };

  load() {
    const settingsItem = localStorage.getItem("botSettings");

    let settings;
    let version = mvb.version;

    const defaultSettings = {
      autoBonfire: true,
      autoLoot: true,
      oreSwitch: false,
      autoFarm: true,
      version,
    };

    if (!settingsItem) {
      localStorage.setItem("botSettings", JSON.stringify(defaultSettings));
      settings = defaultSettings;
    } else {
      settings = JSON.parse(settingsItem);
      if (!settings.version || settings.version < version) {
        const mergedSettings = { ...defaultSettings, ...settings, version };
        console.log(
          "Bot settings were too old (%s), replacing them with version %s",
          settings.version ?? "no version",
          version
        );
        localStorage.setItem("botSettings", JSON.stringify(mergedSettings));
        settings = mergedSettings;
      }
    }

    this.settings = settings;

    console.log("Settings loaded with version: %s", version);
  }

  saveSettings() {
    localStorage.setItem("botSettings", JSON.stringify(this.settings));
  }
}
