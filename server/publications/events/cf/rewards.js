import { RewardIcons } from "/imports/api/sponsorship/reward_icon.js";
import Rewards from "/imports/api/sponsorship/rewards.js";

Meteor.publish("rewards", (slug) => {
  var event = Events.findOne({slug});
  var rewards = Rewards.find({ _id: { $in: (event.crowdfunding || {}).rewards || [] } }, { sort: { value: 1 } });
  return [
    rewards,
    RewardIcons.find({_id: { $in: rewards.map((r) => { return r.img; }) }}).cursor
  ];
});

Meteor.publish("rewardsToReview", () => {
  var events = Events.find({underReview: true});
  var rewards = [];
  events.forEach(event => {
    rewards = rewards.concat(event.crowdfunding.rewards);
  });
  var tempRewards = Rewards.find({ _id: { $in: Array.from(new Set(rewards)) } })
  return [
    tempRewards,
    RewardIcons.find({ _id: { $in: tempRewards.map(r => { return r.img }) } }).cursor
  ]
})
