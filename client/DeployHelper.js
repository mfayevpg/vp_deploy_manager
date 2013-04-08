/**
 * User: Maskime
 * Date: 03/04/13
 * Time: 19:30
 */
var DeployHelper = {
    currentDeployKey : 'currentDeploy',
    branchListUpdateKey: 'branchListUpdate',
    isFullscreenKey: 'isFullscreen',
    taskListUpdateKey: 'taskListUpdate',
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
        this.toggleSessionValue(this.branchListUpdateKey);
    },

    getBranchListUpdateState:function(){
        return this.getSessionVar(this.branchListUpdateKey);
    },
    getSessionVar: function(key){
        var out = null;
        var value = Session.get(key);
        if(typeof value != 'undefined' && value != null){
            out = value;
        }

        return out;
    },
    toggleFullscreen: function(){
        this.toggleSessionValue(this.isFullscreenKey);
    },
    toggleSessionValue: function(key){
        var value = Session.get(key);
        var out = true;
        if(typeof value != 'undefined' && value != null){
            out = !value;
        }
        console.log('Set value for [' + key + ']', out);
        Session.set(key, out);
    },
    isFullscreen: function(){
        return this.getSessionVar(this.isFullscreenKey);
    },
    setTaskListMinAndMaxPosition: function(taskListCursor){
        var positionList = [];
        taskListCursor.forEach(function(task){
            positionList.push(task.position);
        });
    },
    getTaskListUpdateState: function(){
        return this.getSessionVar(this.taskListUpdateKey);
    },
    toggleTaskListUpdateState : function(){
        this.toggleSessionValue(this.taskListUpdateKey);
    }
};