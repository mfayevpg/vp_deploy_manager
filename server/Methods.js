/**
 * User: mfaye
 * Date: 02/04/13
 * Time: 12:32
 */
Meteor.methods({
    createEmptyDeploy: function(){
        var self = this;

        var emptyDeploy= {
            date: null,
            status : 'edit',
            startDate: null,
            endDate: null,
            playerList: [],
            taskList: [],
            branchList: []
        };

        return DeploymentList.insert(emptyDeploy);
    }
});