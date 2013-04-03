/**
 * User: mfaye
 * Date: 02/04/13
 * Time: 12:32
 */
Meteor.methods({
    createEmptyDeploy: function () {
        var self = this;
        var currentUser = Meteor.user();
        var embeddedUser = _.pick(currentUser.profile,'avatar_url', 'name', 'html_url');
        embeddedUser['_id'] = currentUser._id;
        var emptyDeploy = {
            date: null,
            status: 'edit',
            startDate: null,
            endDate: null,
            playerList: [embeddedUser],
            taskList: [],
            branchList: []
        };

        return DeploymentList.insert(emptyDeploy);
    }
});