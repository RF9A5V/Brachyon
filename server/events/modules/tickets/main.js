import Instances from "/imports/api/event/instance.js";

Meteor.methods({
  "events.tickets.create"(id, subName) {
    var event = Events.findOne(id);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var cmd = {
      $set: {
        "tickets": {
          venue: {
            price: 0,
            description: "",
            entry: false
          },
          spectator: {
            price: 0,
            description: "",
            entry: false
          }
        }
      }
    };
    if(instance.brackets) {
      instance.brackets.forEach((bracket, index) => {
        cmd["$set"]["tickets"][`${index}`] = {
          price: 0,
          description: "",
          entry: true
        }
      });
    }
    Instances.update(instance._id, cmd);
  },

  "events.tickets.delete"(id) {
    var event = Events.findOne(id);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    Instances.update(instance._id, {
      $unset: {
        tickets: ""
      }
    })
  },

  "events.addModule.tickets"(id) {
    const event = Events.findOne(id);
    const instance = Instances.findOne(event.instances[event.instances.length - 1]);
    const { tickets, brackets } = instance;

    var updateObj = {
      venue: {
        price: 0,
        payments: {}
      },
      payables: {},
      paymentType: "onsite"
    };

    brackets.forEach((b, i) => {
      updateObj[i] = {
        price: 0,
        payments: {}
      }
    });

    Instances.update(instance._id, {
      $set: {
        "tickets": updateObj
      }
    })
  },
  "events.removeModule.tickets"(id) {
    const event = Events.findOne(id);
    const instance = Instances.findOne(event.instances[event.instances.length - 1]);

    Instances.update(instance._id, {
      $unset: {
        tickets: 1
      }
    })
  },
  "events.tickets.deleteDiscount"(id, bracketIndex, index) {
    const instance = Instances.findOne(id);
    var discounts = instance.tickets[bracketIndex].discounts;
    discounts.splice(index, 1);
    Instances.update(id, {
      $set: {
        [`tickets.${bracketIndex}.discounts`]: discounts
      }
    });
  }
})
