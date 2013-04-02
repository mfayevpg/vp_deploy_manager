/**
 * User: mfaye
 * Date: 28/03/13
 * Time: 18:26
 */
DeploymentList = new Meteor.Collection('deployments');

Meteor.publish('deployment-list', function(){
    return DeploymentList.find({}, {fields: {_id: 1, date: 1, status: 1}});
});

Meteor.publish('users', function(){
    return Meteor.users.find({});
});

function isAdmin(userId){
    return (Meteor.users.find({_id: userId}).count() == 1);
}

Meteor.users.allow({
    update: function(userId, doc, fieldNames, modifier){
        return isAdmin(userId);
    }
});

DeploymentList.allow({
    insert:function(userId){
        return isAdmin(userId);
    },
    update:function(userId){
        return (userId != null);
    }
});