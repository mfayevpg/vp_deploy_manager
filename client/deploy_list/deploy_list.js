/**
 * User: mfaye
 * Date: 02/04/13
 * Time: 11:41
 */
Template.deploymentsList.helpers({
    list : function(){
        return DeploymentList.find({date: {$ne: null}});
    }
});