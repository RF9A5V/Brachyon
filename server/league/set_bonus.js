import Leagues from "/imports/api/leagues/league.js";

Meteor.methods({
  "leagues.leaderboard.setBonus"(id, index, userId, points) {
    var league = Leagues.findOne(id);
    if(!league) {
      throw new Meteor.Error(404, "League not found!");
    }

    var currentBonus = league.leaderboard[index][userId].bonus;
    var diff = points - currentBonus;

    Leagues.update(id, {
      $set: {
        [`leaderboard.${index}.${userId}.bonus`]: points
      }
    });
  },
  "leagues.checkEventCanRun"(league, slug) {
    var league = Leagues.findOne(league);
    if(!league) {
      throw new Meteor.Error(404, "League not found!");
    }
    var eventIndex = league.events.indexOf(slug);
    if(eventIndex < 0) {
      throw new Meteor.Error(404, "Event in league not found!");
    }
    if(eventIndex == 0) {
      return {
        success: true
      };
    }
    var prevEvent = Events.findOne({ slug: league.events[eventIndex - 1] });
    var instance = Instances.findOne(prevEvent.instances.pop());
    var allBracketsRun = instance.brackets.map(b => { return b.isComplete }).every(c => { return c });
    if(!allBracketsRun) {
      return {
        success: false,
        action: "bracket",
        link: `/events/${prevEvent.slug}/brackets/0/admin`
      };
    }
    if(!prevEvent.isComplete) {
      return {
        success: false,
        action: "event",
        id: prevEvent._id
      }
    }
    return {
      success: true
    }
  }
})
