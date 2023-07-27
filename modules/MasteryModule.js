class MasteryModule {
  load() {
    const dis = this;
    mvb.addPoller(
      "MasteryModule",
      () => {
        game.skills.forEach(dis.levelup);
      },
      100
    );
  }

  levelup(skill) {
    if (!skill.hasMastery) return;

    if (skill.masteryPoolProgress < 100 - 0.2) {
      game.bank.claimItemOnClick(skill.masteryToken, Infinity);
    }

    if (skill.masteryPoolProgress < masteryCheckpoints.at(-1)) {
      //mvb.log("This skill doesn't have last mastery checkpoint yet!")
      return;
    }

    let action = skill.actions.allObjects
      .filter((x) => skill.getMasteryProgress(x).level !== 99)
      .sort((a, b) => {
        const aProgress = skill.getMasteryProgress(a);
        const bProgress = skill.getMasteryProgress(b);
        return aProgress.nextLevelXP - aProgress.xp - (bProgress.nextLevelXP - bProgress.xp);
      })[0];

    if (!action) return;

    const progress = skill.getMasteryProgress(action);
    if (progress.level >= 99) {
      //mvb.log("%s already maxed", action._localID)
      return;
    }

    const nextLevel = Math.min(progress.level + 1, 99);
    const xpRequired = exp.level_to_xp(nextLevel) - progress.xp + 1;
    const poolTierChange = skill.getPoolBonusChange(-xpRequired);

    const currentXP = this.getMasteryXP(action);
    const nextXP = exp.level_to_xp(nextLevel) + 1;
    const xpToAdd = nextXP - currentXP;
    if (skill.masteryPoolXP < xpToAdd) return;

    if (xpRequired <= skill.masteryPoolXP && (poolTierChange === 0 || skill.masteryPoolProgress >= 100)) {
      mvb.log("Leveled up %s from %s to %s", action._localID, progress.level, nextLevel);
      //skill.levelUpMasteryWithPoolXP(action, 1);
      skill.exchangePoolXPForActionXP(action, xpToAdd);
    } else {
      //mvb.log("We could not level up " + action._localID)
    }
  }
}
