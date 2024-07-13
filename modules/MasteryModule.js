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

    let masteryPoolProgress = skill.getMasteryPoolProgress(skill.currentRealm);

    let masteryTokens = skill.masteryTokens.get(skill.currentRealm);

    if (masteryTokens && masteryTokens.length > 0) {
      if (masteryPoolProgress < 100 - 0.2) {
        game.bank.claimItemOnClick(masteryTokens[0], Infinity);
      }
    }

    if (masteryPoolProgress < skill.masteryPoolBonuses.get(skill.currentRealm).at(-1)) {
      mvb.log("This skill doesn't have last mastery checkpoint yet!")
      return;
    }

    let action = skill.actions.allObjects
      .filter((x) => skill.getMasteryProgress(x).level !== 99 && x.realm === skill.currentRealm)
      .sort((a, b) => {
        const aProgress = skill.getMasteryProgress(a);
        const bProgress = skill.getMasteryProgress(b);
        return aProgress.nextLevelXP - aProgress.xp - (bProgress.nextLevelXP - bProgress.xp);
      })[0];

    if (!action) return;

    const progress = skill.getMasteryProgress(action);
    if (progress.level >= 99) {
      mvb.log("%s already maxed", action._localID)
      return;
    }

    const nextLevel = Math.min(progress.level + 1, 99);
    const xpRequired = exp.level_to_xp(nextLevel) - progress.xp + 1;
    const poolTierChange = skill.getPoolBonusChange(skill.currentRealm, -xpRequired);

    if (xpRequired <= skill.getMasteryPoolXP(skill.currentRealm) && (poolTierChange === 0 || masteryPoolProgress >= 100)) {
      mvb.log("Leveled up %s from %s to %s", action._localID, progress.level, nextLevel);
      //skill.levelUpMasteryWithPoolXP(action, 1);
      skill.exchangePoolXPForActionXP(action, xpRequired);
    } else {
      //mvb.log("We could not level up " + action._localID)
      //mvb.log(xpRequired, action)
    }
  }
}
