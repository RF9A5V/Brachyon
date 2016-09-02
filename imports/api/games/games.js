import { Mongo } from 'meteor/mongo';

export default Events = new Mongo.Collection('games', {
  transform: (doc) => {
    if(doc.banner){
      doc.bannerUrl = Images.findOne(doc.banner).url();
    }
    return doc;
  }
});
