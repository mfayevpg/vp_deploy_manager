/**
 * User: mfaye
 * Date: 28/03/13
 * Time: 18:26
 */
DeploymentList = new Meteor.Collection('deployments');
TaskList = new Meteor.Collection('tasks');

function isAdmin(userId){
    return (Meteor.users.find({_id: userId}).count() == 1);
}

function isPlayer(userId, deployId){
    return (DeploymentList.find({_id:deployId, 'playerList._id':userId}).count() > 0);
}

Meteor.publish('deployment-list', function(){
    return DeploymentList.find({});
});

Meteor.publish('users', function(){
    return Meteor.users.find({});
});

Meteor.publish('current-tasks', function(deploymentId){
    return TaskList.find({'deploymentId': deploymentId});
});

Meteor.users.allow({
    update: function(userId, doc, fieldNames, modifier){
        return isAdmin(userId);
    }
});

DeploymentList.allow({
    insert:function(userId){
        return isAdmin(userId);
    },
    update:function(userId, doc, fieldNames, modifier){
        //Only admin are allowed to update status
        var out = (userId != null);
        if(_.indexOf(fieldNames, 'status') != -1){
            out = isAdmin(userId);
        }
        return out;
    },
    remove:function(userId){
        return isAdmin(userId);
    }
});

TaskList.allow({
    insert: function(userId,doc){
        var out = isAdmin(userId);
        if(!out){
            if(isPlayer(userId, doc.deployId)){
                out = true;
            }
        }

        return out;
    }
});