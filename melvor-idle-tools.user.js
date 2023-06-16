// ==UserScript==
// @name         Melvor Idle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Thunderr
// @match        https://melvoridle.com/index_game.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=melvoridle.com
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    const version = 0.2;

    const settingsItem = localStorage.getItem("botSettings");

    let settings;

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

    function inject() {
        if (!game || !game.loopStarted) {
            setTimeout(inject, 500);
            return;
        }
        setInterval(() => {
            if (!game.firemaking.isActive) {
                return;
            }
            if (settings.autoBonfire && !game.firemaking.isBonfireActive) {
                console.log("Relighting bonfire");
                game.firemaking.lightBonfire();
            }
        }, 1000);

        setInterval(() => {
            if (!settings.autoLoot) return;

            if (game.combat.loot.drops.length >= game.combat.loot.maxLoot) {
                game.combat.loot.lootAll();
            }
        }, 1000);

        setInterval(() => {
            if (!settings.autoFarm) return;

            const compost = game.items.composts.getObjectByID("melvorD:Compost");

            game.farming.plots.allObjects.forEach((plot) => {
                switch (plot.state) {
                    case 1:
                        if (plot.compostLevel != 100 && game.bank.hasItem(compost)) {
                            console.log("Trying to compost %s", plot._localID);
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
                        console.log("Trying to plant %s on %s (%O) (%O)", bestRecipe._localID, plot._localID, bestRecipe, plot);
                        game.farming.plantRecipe(bestRecipe, plot);
                        break;
                    case 2:
                        break;
                    case 3:
                        console.log("Trying harvest %s", plot._localID);
                        game.farming.harvestPlot(plot);
                        break;
                    case 4:
                        console.log("Trying to clear dead %s", plot._localID);
                        game.farming.clearDeadPlot(plot);
                        break;
                }
            });
        }, 1000);

        setInterval(() => {
            if (!game.mining.isActive) {
                return;
            }

            if (!settings.oreSwitch) return;

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
                    console.log("Changing to %s as it's better", bestRock.localID);
                    game.mining.onRockClick(bestRock);
                }
            }
        }, 1000);

        setInterval(() => {
            function levelup(skill) {
                if (!skill.hasMastery) return;

                game.bank.claimItemOnClick(skill.masteryToken, Infinity);

                if (skill.masteryPoolProgress < masteryCheckpoints.at(-1)) {
                    //console.log("This skill doesn't have last mastery checkpoint yet!")
                    return
                }

                let action = skill.actions.allObjects.sort((a, b) => {
                    const aProgress = skill.getMasteryProgress(a);
                    const bProgress = skill.getMasteryProgress(b);
                    return aProgress.level - bProgress.level
                })[0]

                const progress = skill.getMasteryProgress(action);
                if (progress.level >= 99) {
                    //console.log("%s already maxed", action._localID)
                    return;
                }

                const nextLevel = Math.min(progress.level + 1, 99);
                const xpRequired = exp.level_to_xp(nextLevel) - progress.xp + 1;
                const poolTierChange = skill.getPoolBonusChange(-xpRequired);

                if (xpRequired <= skill.masteryPoolXP && poolTierChange === 0) {
                    console.log("Leveled up %s from %s to %s", action._localID, progress.level, nextLevel)
                    skill.levelUpMasteryWithPoolXP(action, 1);
                } else {
                    //console.log("We could not level up " + action._localID)
                }
            }

            game.skills.forEach(levelup);
        }, 100);

        console.log("Bot injected");
    }

    inject();
})();
