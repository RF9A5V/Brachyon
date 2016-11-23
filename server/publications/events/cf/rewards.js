import { RewardIcons } from "/imports/api/sponsorship/reward_icon.js";
import Rewards from "/imports/api/sponsorship/rewards.js";

Meteor.publish("rewards", (id) => {
  var event = Events.findOne(id);
  var rewards = Rewards.find({ _id: { $in: event.crowdfunding.rewards || [] } }, { sort: { value: 1 } });
  return [
    rewards,
    RewardIcons.find({_id: { $in: rewards.map((r) => { return r.img; }) }}).cursor
  ];
})
