import Instances from "/imports/api/event/instance.js";

Migrations.add({
  version: 5,
  up: () => {
    var instances = Instances.find({
      "brackets.hash": {
        $ne: null
      }
    });
    instances.forEach(i => {
      var brackets = i.brackets;
      var setObj = {};
      var unsetObj = {};
      brackets.forEach((b, i) => {
        if(b.hash) {
          setObj[`brackets.${i}.slug`] = b.slug + "-" + b.hash;
          unsetObj[`brackets.${i}.hash`] = 1;
        }
      });
      Instances.update(i._id, {
        $set: setObj,
        $unset: unsetObj
      })
    })
  }
})
