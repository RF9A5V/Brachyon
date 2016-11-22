import { RewardIcons } from "/imports/api/sponsorship/reward_icon.js";

Meteor.publish("rewardImgs", (id) => {
  var event = Events.findOne(id);
  return RewardIcons.find({_id: { $in: event.crowdfunding.rewards.map((r) => { return r.img; }) }}).cursor;
})
