/**
 * User: Maskime
 * Date: 03/04/13
 * Time: 19:30
 */
var DeployHelper = {
    currentDeployKey: 'currentDeploy',
    branchListUpdateKey: 'branchListUpdate',
    isFullscreenKey: 'isFullscreen',
    taskListUpdateKey: 'taskListUpdate',
    playerListUpdateKey: 'playerListUpdate',
    waitingRemovalConfirmationKey: 'waitingForRemovalConfirmation',
    taskToUpdateKey: 'taskToUpdate',

    getCurrentDeploy: function () {
        var currentDeploy = Session.get(DeployHelper.currentDeployKey);
        var out = null;
        if (currentDeploy && currentDeploy._id) {
            out = currentDeploy;
        }

        return out;
    },
    setCurrentDeploy: function (currentDeploy) {
        Session.set(DeployHelper.currentDeployKey, currentDeploy);
    },

    toggleBranchListUpdateState: function () {
        this.toggleSessionValue(this.branchListUpdateKey);
    },

    getBranchListUpdateState: function () {
        return this.getSessionVar(this.branchListUpdateKey);
    },
    getSessionVar: function (key) {
        var out = null;
        var value = Session.get(key);
        if (typeof value != 'undefined' && value != null) {
            out = value;
        }

        return out;
    },
    toggleFullscreen: function () {
        this.toggleSessionValue(this.isFullscreenKey);
    },
    toggleSessionValue: function (key) {
        var value = Session.get(key);
        var out = true;
        if (typeof value != 'undefined' && value != null) {
            out = !value;
        }
        Session.set(key, out);
    },
    isFullscreen: function () {
        return this.getSessionVar(this.isFullscreenKey);
    },
    setTaskListMinAndMaxPosition: function (taskListCursor) {
        var positionList = [];
        taskListCursor.forEach(function (task) {
            positionList.push(task.position);
        });
    },
    getTaskListUpdateState: function () {
        return this.getSessionVar(this.taskListUpdateKey);
    },
    toggleTaskListUpdateState: function () {
        this.toggleSessionValue(this.taskListUpdateKey);
    },
    getPlayerListUpdateState: function () {
        return this.getSessionVar(this.playerListUpdateKey);
    },
    togglePlayerListUpdateState: function () {
        this.toggleSessionValue(this.playerListUpdateKey);
    },
    initializeSession: function () {
        Session.set(this.branchListUpdateKey, null);
        Session.set(this.isFullscreenKey, null);
        Session.set(this.taskListUpdateKey, null);
        Session.set(this.playerListUpdateKey, null);
        Session.set(this.taskToUpdateKey, null);
    },
    addTaskToRemovalConfirmation: function (task) {
        var waitingForRemovalConfirmationList = Session.get(this.waitingRemovalConfirmationKey);
        if (!waitingForRemovalConfirmationList) {
            waitingForRemovalConfirmationList = [];
        }
        waitingForRemovalConfirmationList.push(task);
        Session.set(this.waitingRemovalConfirmationKey, waitingForRemovalConfirmationList);
    },
    removeFromWaitingRemovalConfirmation: function (taskId) {
        var waitingForRemovalConfirmationList = Session.get(this.waitingRemovalConfirmationKey);
        waitingForRemovalConfirmationList = _.reject(waitingForRemovalConfirmationList, function (element) {
            return (element._id == taskId);
        });
        Session.set(this.waitingRemovalConfirmationKey, waitingForRemovalConfirmationList);
    },
    isWaitingForRemovalConfirmation: function(task){
        var waitingForRemovalConfirmationList = Session.get(this.waitingRemovalConfirmationKey);
        return _.find(waitingForRemovalConfirmationList, function (element) {
            return task._id == element._id
        })
    },
    setTaskToUpdate: function(task){
        Session.set(this.taskToUpdateKey, task);
    },
    getTaskToUpdate: function(){
        return this.getSessionVar(this.taskToUpdateKey);
    }
};