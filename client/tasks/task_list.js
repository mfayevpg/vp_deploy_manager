/**
 * User: Maskime
 * Date: 08/04/13
 * Time: 08:30
 */
Template.taskListDisplay.helpers({
    taskList: function () {
        var taskListForDisplay = [];
        var currentDeploy = DeployHelper.getCurrentDeploy();
        if (currentDeploy != null) {
            var currentIndex = 0;
            var selector = {deployId: currentDeploy._id};
            var options = {sort: {position: 1}};
            var taskCursor = TaskList.find(selector, options);
            var taskListLength = taskCursor.count();
            taskCursor.forEach(function (task) {
                task['index'] = currentIndex;
                var isFirst = (currentIndex == 0);
                var isLast = (currentIndex == (taskListLength - 1));
                task['isFirst'] = isFirst;
                task['isLast'] = isLast;
                taskListForDisplay.push(task);
                currentIndex++;
            });
        }

        return taskListForDisplay;
    },
    isUpdate: function () {
        return ((DeployHelper.getTaskListUpdateState()) && (Handlebars._default_helpers.canUpdate()));
    }

});

Template.taskListDisplay.events({
    'click a#updateTaskList': function (event) {
        event.preventDefault();
        DeployHelper.toggleTaskListUpdateState();
    }
});

Template.taskDetailDisplay.events({
    'click a.goDown': function (event) {
        event.preventDefault();
        var nextTask = TaskList.findOne({position: {$gt: this.position}}, {sort: {position: 1}});
        if(nextTask){
            TaskList.update({_id: nextTask._id}, {$set:{position: this.position}});
            TaskList.update({_id: this._id}, {$set:{position: nextTask.position}});
        }
    },
    'click a.goUp': function (event) {
        event.preventDefault();
        var previousTask = TaskList.findOne({position: {$lt: this.position}}, {sort: {position: -1}});
        if(previousTask){
            TaskList.update({_id: previousTask._id}, {$set:{position: this.position}});
            TaskList.update({_id: this._id}, {$set:{position: previousTask.position}});
        }
    },

    /**
     *
     * Task removal management
     *
     */
    'click a.removeTask': function (event) {
        event.preventDefault();
        DeployHelper.addTaskToRemovalConfirmation(this);
    },
    'click a.removalCancellation': function (event) {
        event.preventDefault();
        var self = this;
        DeployHelper.removeFromWaitingRemovalConfirmation(self._id);
    },
    'click a.removalConfirmation': function (event) {
        event.preventDefault();
        var self = this;
        TaskList.remove({_id: self._id}, function (err) {
            if (err) {
                throw err;
            }
            DeployHelper.removeFromWaitingRemovalConfirmation(self._id);
        });
    },

    /**
     *
     * Task update management
     *
     */
    'click a.updateTask': function(event){
        event.preventDefault();
        DeployHelper.setTaskToUpdate(this);
    }
});


/**
 *
 * ROW display
 *
 */


Template.taskDetailDisplay.helpers({
    canGoDown: function () {
        var out = '';
        if(this.isLast){
            out = 'disabled';
        }
        return out;
    },
    canGoUp: function () {
        var out = '';
        if(this.isFirst){
            out = 'disabled';
        }
        return out;
    },
    isUpdate: function () {
        return ((DeployHelper.getTaskListUpdateState()) && (Handlebars._default_helpers.canUpdate()));
    },
    waitingForRemovalConfirmation: function () {
        return DeployHelper.isWaitingForRemovalConfirmation(this);
    }
});