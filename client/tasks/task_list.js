/**
 * User: Maskime
 * Date: 08/04/13
 * Time: 08:30
 */
Template.taskListDisplay.helpers({
    taskList: function(){
        var taskToDisplay = TaskList.find({});
        DeployHelper.setTaskListMinAndMaxPosition(taskToDisplay);
        return  taskToDisplay;
    }
});

Template.taskDetailDisplay.helpers({
    canGoDown: function(){
        return true;
    },
    canGoUp: function(){
        return true;
    }
});