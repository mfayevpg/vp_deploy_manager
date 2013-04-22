/**
 * User: Maskime
 * Date: 08/04/13
 * Time: 08:30
 */

function exchangePosition(taskToExchangeWith, taskToMove, taskToExchangeWithPosition) {
    console.log('Old position : ', taskToMove.position, 'New position : ', taskToExchangeWithPosition);
    TaskList.update({_id: taskToExchangeWith._id}, {$set: {position: taskToMove.position}}, function (err) {
        if (err) {
            throw err;
        }
        TaskList.update({_id: taskToMove._id}, {$set: {position: taskToExchangeWithPosition}});
    });
}

function removeFromWaitingRemovalConfirmation(taskId) {
    var waitingForRemovalConfirmationList = Session.get('waitingForRemovalConfirmation');
    waitingForRemovalConfirmationList = _.reject(waitingForRemovalConfirmationList, function (element) {
        return (element._id == taskId);
    });
    Session.set('waitingForRemovalConfirmation', waitingForRemovalConfirmationList);
}

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

    'click a.removeTask': function (event) {
        event.preventDefault();
        var waitingForRemovalConfirmationList = Session.get('waitingForRemovalConfirmation');
        if (!waitingForRemovalConfirmationList) {
            waitingForRemovalConfirmationList = [];
        }
        waitingForRemovalConfirmationList.push(this);
        Session.set('waitingForRemovalConfirmation', waitingForRemovalConfirmationList);
    },
    'click a.removalCancellation': function (event) {
        event.preventDefault();
        var self = this;
        removeFromWaitingRemovalConfirmation(self._id);
    },
    'click a.removalConfirmation': function (event) {
        event.preventDefault();
        var self = this;
        TaskList.remove({_id: self._id}, function (err) {
            if (err) {
                throw err;
            }
            removeFromWaitingRemovalConfirmation(self._id);
        });
    }
});

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
        var self = this;
        var waitingForRemovalConfirmationList = Session.get('waitingForRemovalConfirmation');
        return _.find(waitingForRemovalConfirmationList, function (element) {
            return self._id == element._id
        })
    }
});

Template.taskForm.rendered = function () {
    $('#separator').click(function () {
        var $self = $(this);
        var isChecked = ((typeof $self.attr('checked') != 'undefined') && ($self.attr('checked') == 'checked'));
        var selectorList = ['#productName', '[id^=bu_]', '#command', '#server'];
        _.forEach(selectorList, function (selector) {
            if (isChecked) {
                $(selector).attr('disabled', 'disabled');
            } else {
                $(selector).attr('disabled', null);
            }
        });
    });
};

Template.taskForm.events({
    'click a#addTask': function (event) {
        event.preventDefault();
        var currentDeploy = DeployHelper.getCurrentDeploy();
        if (currentDeploy != null) {
            var taskForm = new TaskForm(currentDeploy);
            if (taskForm.isValid()) {
                var taskDocument = new TaskDocument();
                taskDocument.fromForm(taskForm.getObject());
                var maxOrder = TaskList.findOne({deployId: currentDeploy._id}, {sort: {position: -1}});
                var newOrder = 1;
                if (maxOrder) {
                    newOrder = maxOrder.position + 1;
                }
                taskDocument.updateOrder(newOrder);
                TaskList.insert(taskDocument.toDocument(), function (error, insertedId) {
                    taskDocument._id = insertedId;
                    if (error) {
                        throw error;
                    }
                    taskForm.clean();
                });
            } else {
                taskForm.highlightErrors();
            }
        }
    }
});