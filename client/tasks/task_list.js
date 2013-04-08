/**
 * User: Maskime
 * Date: 08/04/13
 * Time: 08:30
 */
Template.taskListDisplay.helpers({
    taskList: function(){
        return  TaskList.find({});
    },
    isUpdate: function() {
        console.log(DeployHelper.getTaskListUpdateState());
        return DeployHelper.getTaskListUpdateState();
    }
});

Template.taskListDisplay.events({
    'click a#updateTaskList': function(event){
        event.preventDefault();
        console.log('TOTO');
        DeployHelper.toggleTaskListUpdateState();
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