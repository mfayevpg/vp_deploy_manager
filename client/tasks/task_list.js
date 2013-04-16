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
            var options = {ordered: {position: 1}};
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
    }
    ,
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
    'click a.goDown': function(event){
        event.preventDefault();
        console.log(event, this);
    },
    'click a.goUp': function(event){
        event.preventDefault();
        console.log(event, this);
    }
});

Template.taskDetailDisplay.helpers({
    canGoDown: function () {
        return !this.isLast;
    },
    canGoUp: function () {
        return !this.isFirst;
    },
    isUpdate: function () {
        return ((DeployHelper.getTaskListUpdateState()) && (Handlebars._default_helpers.canUpdate()));
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
                var maxOrder = TaskList.findOne({deployId: currentDeploy._id}, {sort:{position: -1}});
                var newOrder = 1;
                if(maxOrder){
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