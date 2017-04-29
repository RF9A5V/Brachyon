Meteor.methods({
  "events.brackets.edit"(instanceId, index, name, game, format, options) {
    const instance = Instances.findOne(instanceId);
    const bracket = instance.brackets[index];
    // Only works for simple formats currently
    const formatChanged = bracket.format.baseFormat != format.baseFormat;
    Instances.update(instanceId, {
      $set: {
        [`brackets.${index}.name`]: name,
        [`brackets.${index}.game`]: game,
        [`brackets.${index}.format`]: format,
        [`brackets.${index}.options`]: options
      }
    });
  }
})
