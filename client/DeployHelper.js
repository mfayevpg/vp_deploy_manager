/**
 * User: Maskime
 * Date: 03/04/13
 * Time: 19:30
 */
var DeployHelper = {
    currentDeployKey : 'currentDeploy',
    branchListUpdateKey: 'branchListUpdate',
    isFullscreenKey: 'isFullscreen',
    getCurrentDeploy: function(){
        var currentDeploy = Session.get(DeployHelper.currentDeployKey);
        var out = null;
        if(currentDeploy && currentDeploy._id){
            out = currentDeploy;
        }

        return out;
    },
    setCurrentDeploy : function(currentDeploy){
        Session.set(DeployHelper.currentDeployKey, currentDeploy);
    },

    toggleBranchListUpdateState: function(){
        var currentState = Session.get(this.branchListUpdateKey);
        if(typeof currentState != 'undefined' && currentState != null){
            currentState = !currentState;
        }else{
            currentState = true;
        }
        Session.set(this.branchListUpdateKey, currentState);
    },

    getBranchListUpdateState:function(){
        var out = null;
        var value = Session.get(this.branchListUpdateKey);
        if(typeof value != 'undefined' && value != null){
            out = value;
        }

        return out;
    },
    toggleFullscreen: function(){
        var value = Session.get(this.isFullscreenKey);
        var out = true;
        if(typeof value != 'undefined' && value != null){
            out = !value;
        }
        Session.set(this.isFullscreenKey, out);
    },
    isFullscreen: function(){
        var value = Session.get(this.isFullscreenKey);
        var out = false;
        if(typeof value != 'undefined' && value != null){
            out = value;
        }

        return out;
    },
    setTaskListMinAndMaxPosition: function(taskListCursor){
        var positionList = [];
        taskListCursor.forEach(function(task){
            positionList.push(task.position);
        });
    }
};