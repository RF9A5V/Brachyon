Meteor.methods({
  "events.revenue.createTicketCost"(id, name, amount, description) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $push: {
        "revenue.tickets": {
          name,
          amount,
          description
        }
      }
    })
  },
  "events.revenue.updateTicketCost"(id, indexId, amount, description) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $set: {
        [`revenue.tickets.${indexId}`]: {
          price: amount,
          description
        }
      }
    })
  },
  "events.revenue.tickets.grantPrivileges"(id, ticketIds){
    var event = Events.findOne();
    if(!event) {
      throw new Meteor.Error(404, "Event not found!");
    }
    var user = Meteor.user();
    if(!user) {
      throw new Meteor.Error(403, "Need to be logged in!");
    }
    var bracketIndices = [];
    ticketIds.forEach((ticket) => {
      var check = ticket.match(/[0-9]+/);
      if(check && check.length > 0){
        bracketIndices.push(parseInt(check[0]));
      }
    });
    console.log(bracketIndices);
    bracketIndices.forEach((index) => {
      Events.update(id, {
        $push: {
          [`brackets.${index}.participants`]: {
            alias: user.username,
            id: user._id,
            email: user.emails[0].address
          }
        }
      })
    })
  }
})
