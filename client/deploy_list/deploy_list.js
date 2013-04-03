/**
 * User: mfaye
 * Date: 02/04/13
 * Time: 11:41
 */
Template.deploymentsList.helpers({
    list : function(){
        return DeploymentList.find({date: {$ne: null}});
    },
    badgeClassDeploy: function(){
        var out = 'badge ';
        switch(this.status){
            case 'in_progress':
                out += 'badge-warning';
                break;
            case 'done':
                out += 'badge-important';
                break;
            case 'edit':
            default:
                out += '';
        }

        return out;
    },
    isActiveDeployClass : function(){
        var out = '';
        var currentDeploy = DeployHelper.getCurrentDeploy();
        if(currentDeploy != null){
            if(currentDeploy._id == this._id){
                out = 'active';
            }
        }

        return out;
    }
});