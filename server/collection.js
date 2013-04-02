/**
 * User: mfaye
 * Date: 28/03/13
 * Time: 18:26
 */
DeploymentList = new Meteor.Collection('deployments');

Meteor.publish('deployment-list', function(){
    return DeploymentList.find({}, {fields: {_id: 1, date: 1, status: 1}});
});