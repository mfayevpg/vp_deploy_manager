/**
 * User: mfaye
 * Date: 02/04/13
 * Time: 12:12
 */

DeploymentList = new Meteor.Collection('deployments');
TaskList = new Meteor.Collection('tasks');

Meteor.subscribe('deployment-list');

Meteor.subscribe('users');

Meteor.autorun(function () {
    var currentDeploy = DeployHelper.getCurrentDeploy();
    if (currentDeploy != null) {
        Meteor.subscribe('current-tasks', currentDeploy._id);
    }
});

TaskDocument = function () {
    var self = this;

    this.deployId = null;
    this.isSeparator = null;
    this.productName = null;
    this.buList = null;
    this.command = null;
    this.description = null;
    this.server = null;
    this.position = null;

    this.fromForm = function (p_formObject) {
        self.deployId = p_formObject.deployId;
        self.isSeparator = p_formObject.isSeparator;
        self.productName = p_formObject.productName;
        self.buList = p_formObject.buList;
        self.command = p_formObject.command;
        self.description = p_formObject.description;
        self.server = p_formObject.server;
        self.position = p_formObject.position;

    };
    this.toDocument = function () {
        return {
            deployId: self.deployId,
            isSeparator: self.isSeparator,
            productName: self.productName,
            buList: self.buList,
            command: self.command,
            description: self.description,
            server: self.server,
            position: self.position
        };
    };
    this.updateOrder = function(newPosition){
        self.position = newPosition;
    };
};