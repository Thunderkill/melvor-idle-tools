class MasteryModule {
  start() {
    const dis = this;
    mvb.pollers.push([
      () => {
        game.skills.forEach(dis.levelup);
      },
      100,
    ]);
  }

  levelup(skill) {
    if (!skill.hasMastery) return;

    if (skill.masteryPoolProgress < 100 - 0.2) {
      game.bank.claimItemOnClick(skill.masteryToken, Infinity);
    }

    if (skill.masteryPoolProgress < masteryCheckpoints.at(-1)) {
      //console.log("This skill doesn't have last mastery checkpoint yet!")
      return;
    }

    let action = skill.actions.allObjects.sort((a, b) => {
      const aProgress = skill.getMasteryProgress(a);
      const bProgress = skill.getMasteryProgress(b);
      return aProgress.level - bProgress.level;
    })[0];

    const progress = skill.getMasteryProgress(action);
    if (progress.level >= 99) {
      //console.log("%s already maxed", action._localID)
      return;
    }

    const nextLevel = Math.min(progress.level + 1, 99);
    const xpRequired = exp.level_to_xp(nextLevel) - progress.xp + 1;
    const poolTierChange = skill.getPoolBonusChange(-xpRequired);

    if (xpRequired <= skill.masteryPoolXP && poolTierChange === 0) {
      console.log("Leveled up %s from %s to %s", action._localID, progress.level, nextLevel);
      skill.levelUpMasteryWithPoolXP(action, 1);
    } else {
      //console.log("We could not level up " + action._localID)
    }
  }
}
