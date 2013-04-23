/**
 * User: mfaye
 * Date: 22/04/13
 * Time: 16:37
 */
Template.taskForm.rendered = function () {
    var currentDeploy = DeployHelper.getCurrentDeploy();
    var taskForm = new TaskForm(currentDeploy);
    $('#separator').click(function () {
        taskForm.toggleSeparatorMode();
    });
    var taskToUpdate = DeployHelper.getTaskToUpdate();
    if (taskToUpdate != null) {
        taskForm.initFormWithTask(taskToUpdate)
    }
};

Template.taskForm.helpers({
    isInsert: function () {
        var taskToUpdate = DeployHelper.getTaskToUpdate();
        return (taskToUpdate == null);
    }
});

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
    },
    'click a.toInsertMode': function (event) {
        event.preventDefault();
        DeployHelper.setTaskToUpdate(null);
        var taskForm = new TaskForm(null);
        taskForm.clean();
    }
});