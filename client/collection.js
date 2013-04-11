/**
 * User: mfaye
 * Date: 02/04/13
 * Time: 12:12
 */

DeploymentList = new Meteor.Collection('deployments');
TaskList = new Meteor.Collection('tasks');

Meteor.subscribe('deployment-list');

Meteor.subscribe('users');

Meteor.autorun(function(){
    var currentDeploy = DeployHelper.getCurrentDeploy();
    if(currentDeploy != null){
        Meteor.subscribe('current-tasks', currentDeploy._id);
    }
});

TaskDocument = function(){
    var self = this;
    this.fromForm = function(p_formObject){

    };
    this.toDocument = function(){

    };
};