Meteor.methods({
  "events.brackets.edit"(instanceId, index, bracketObj) {
    const instance = Instances.findOne(instanceId);
    const bracket = instance.brackets[index];
    const conflict = Instances.findOne({
      "brackets.slug": bracketObj.slug,
      _id: {
        $ne: instanceId
      }
    });
    if(conflict) {
      throw new Meteor.Error(400, "Slug taken.");
    }
    const slugIndex = instance.brackets.findIndex(o => {
      return o.slug == bracketObj.slug;
    });
    if(slugIndex >= 0 && slugIndex != index) {
      console.log(slugIndex, index);
      throw new Meteor.Error(400, "Slug taken.");
    }
    // Only works for simple formats currently
    const formatChanged = bracket.format.baseFormat != bracketObj.format.baseFormat;
    Instances.update(instanceId, {
      $set: {
        [`brackets.${index}.name`]: bracketObj.name,
        [`brackets.${index}.game`]: bracketObj.game,
        [`brackets.${index}.format`]: bracketObj.format,
        [`brackets.${index}.options`]: bracketObj.options,
        [`brackets.${index}.slug`]: bracketObj.slug
      }
    });
  }
})
