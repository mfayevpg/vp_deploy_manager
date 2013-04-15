/**
 * User: Maskime
 * Date: 08/04/13
 * Time: 08:30
 */
Template.taskListDisplay.helpers({
    taskList: function(){
        var taskListForDisplay = [];
        var currentDeploy = DeployHelper.getCurrentDeploy();
        if(currentDeploy != null){
            var currentIndex = 0;
            TaskList.find({deployId: currentDeploy._id}, {ordered:{position: 1}}).forEach(function(task){
                task['index'] = currentIndex;
                taskListForDisplay.push(task);
                currentIndex++;
            });
        }

        return taskListForDisplay;
    },
    isUpdate: function() {
        return (DeployHelper.getTaskListUpdateState() && Handlebars._default_helpers.canUpdate());
    }
});

Template.taskListDisplay.events({
    'click a#updateTaskList': function(event){
        event.preventDefault();
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

Template.taskForm.rendered = function(){
    $('#separator').click(function(){
        var $self = $(this);
        var isChecked = ((typeof $self.attr('checked') != 'undefined') && ($self.attr('checked') == 'checked'));
        var selectorList = ['#productName', '[id^=bu_]', '#command', '#server'];
        _.forEach(selectorList, function(selector){
            if(isChecked){
                $(selector).attr('disabled', 'disabled');
            }else{
                $(selector).attr('disabled', null);
            }
        });
    });
};

Template.taskForm.events({
    'click a#addTask': function(event){
        event.preventDefault();
        var currentDeploy = DeployHelper.getCurrentDeploy();
        if(currentDeploy != null){
            var taskForm = new TaskForm(currentDeploy);
            if(taskForm.isValid()){
                var taskDocument = new TaskDocument();
                taskDocument.fromForm(taskForm.getObject());
                TaskList.insert(taskDocument.toDocument(), function(error, insertedId){
                    taskDocument._id = insertedId;
                    if(error){
                        throw error;
                    }
                    DeploymentList.update({_id: currentDeploy._id}, {$push:{taskList:insertedId}}, function(err){
                        if(err){
                            throw err;
                        }
                        DeployHelper.addTask(taskDocument);
                        taskForm.clean();
                    });
                });
            }else{
                taskForm.highlightErrors();
            }
        }
//        var $separator = $('#separator');
//        var isSeparator = ((typeof $separator.attr('checked') != 'undefined') && ($separator.attr('checked') == 'checked'));
//        if(!isSeparator){
//            var selectorList = ['#productName', '#description', '#command', '#server'];
//            for(var i = 0; i < selectorList.length; i++){
//                var currentSelector = selectorList[i];
//                var $currentField = $(currentSelector);
//                if($currentField.val() != ''){
//                    console.log(currentSelector, $currentField.val());
//
//                }else{
//                    $currentField.addClass();
//                    console.log('No value for ' + currentSelector);
//                }
//
//            }
//        }else{
//        }
    }
});