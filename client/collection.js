/**
 * User: mfaye
 * Date: 02/04/13
 * Time: 12:12
 */

DeploymentList = new Meteor.Collection('deployments');

Meteor.subscribe('deployment-list', function(){
    console.log('deployment-list Done');
});

Meteor.subscribe('users', function(){
    console.log('users Done');
});