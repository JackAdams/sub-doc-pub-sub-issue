Posts = new Meteor.Collection('posts');

if (Meteor.isClient) {
  
  Session.set('allData',true);
  Session.set('sub',null);
  
  Deps.autorun(function() {
    Meteor.subscribe('posts',Session.get('allData'));
  });
  
  Deps.autorun(function() {
    if (Session.get('sub')) {
      Meteor.subscribe('likeCount'); 
    }
  });
  
  Template.hello.helpers({
    post: function () {
      return Posts.findOne();
    },
    sub: function() {
     return Session.get('sub'); 
    }
  });

  Template.hello.events({
    'click #toggle': function () {
      Session.set('allData',!Session.get('allData'));
    },
    'click #sub' : function () {
      Session.set('sub',!Session.get('sub'));
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Posts.find().count()) {
      Posts.insert({text:"Example post",postData:{commentCount:4,likeCount:7}});
    }
  });
  Meteor.publish('posts',function(all) {
    var fields = {"text":1,"postData.likeCount":1};
    if (all) {
      fields["postData.commentCount"] = 1;
    }
    console.log(fields);
    return Posts.find({},{fields:fields});      
  });
  Meteor.publish('likeCount',function() {
    return Posts.find({},{fields:{"text":1,"postData.likeCount":1}});
  });
}
