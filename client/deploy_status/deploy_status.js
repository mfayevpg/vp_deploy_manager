/**
 * User: mfaye
 * Date: 02/04/13
 * Time: 16:38
 */
Template.mepStatus.helpers({
    canDisplayStatus: function () {
        var isUpdate = Session.get('isUpdateDeployStatus');
        var out = false;
        var currentDeploy = DeployHelper.getCurrentDeploy();
        if(currentDeploy != null){
            out = (currentDeploy.date != null);
            out = (out && currentDeploy.status != '');
            if (typeof isUpdate != 'undefined') {
                out = (out && !isUpdate);
            }
        } else {
            out = true;
        }

        return out;
    }
});

Template.displayCurrentStatus.events({
    'click a#updateDate': function (event) {
        event.preventDefault();
        Session.set('isUpdateDeployStatus', true);
    }
});

function getLabelStatusClass() {
    var out = '';
    var currentDeploy = DeployHelper.getCurrentDeploy();
    if(currentDeploy != null){
        if (currentDeploy.status == 'in_progress') {
            out = 'label-warning';
        } else if (currentDeploy.status == 'done') {
            out = 'label-important';
        }
    }

    return out;
}

function getStatusLabel() {
    var out = '';
    var currentDeploy = DeployHelper.getCurrentDeploy();
    if(currentDeploy != null){
        if (currentDeploy.status == 'in_progress') {
            out = 'In Progress';
        } else if (currentDeploy.status == 'done') {
            out = 'Done';
        } else if (currentDeploy.status == 'edit') {
            out = "Editing";
        }
    }

    return out;
}

function getCurrentDeployDate() {
    var out = '';
    var currentDeploy = DeployHelper.getCurrentDeploy();
    if(currentDeploy != null){
        out = currentDeploy.date;
    }
    return out;
}

Template.displayCurrentStatus.helpers({
    getLabelStatusClass: function () {
        return getLabelStatusClass();
    },
    getStatusLabel: function () {
        return getStatusLabel();
    },
    date: function () {
        return getCurrentDeployDate();
    }
});

Template.editCurrentStatus.helpers({
    getLabelStatusClass: function () {
        return getLabelStatusClass();
    },
    getStatusLabel: function () {
        return getStatusLabel();
    },
    date: function () {
        return getCurrentDeployDate();
    }
});

Template.editCurrentStatus.events({
    'click a.btn.btn-success.btn-mini': function (event) {
        event.preventDefault();
        var $date = $('#currentDeployDate');
        if ($date.val() != '') {
            var currentDeploy = DeployHelper.getCurrentDeploy();
            currentDeploy.date = $date.val();
            DeploymentList.update({_id: currentDeploy._id}, {$set: {date: $date.val()}});
            DeployHelper.setCurrentDeploy(currentDeploy);
            Session.set('isUpdateDeployStatus', false);
        }
    }
});

function switchStatus(newStatus) {
    var currentDeploy = DeployHelper.getCurrentDeploy();
    if(currentDeploy != null){
        currentDeploy.status = newStatus;
        DeploymentList.update({_id: currentDeploy._id}, {$set: {status: currentDeploy.status}});
        DeployHelper.setCurrentDeploy(currentDeploy);
    }
}

Template.adminActions.events({
    'click a#toInProgress': function (event) {
        event.preventDefault();
        switchStatus('in_progress');
    },
    'click a#toEdit': function (event) {
        event.preventDefault();
        switchStatus('edit');
    }
});

Template.modalRemovalConfirmation.helpers({
    date: function () {
        return getCurrentDeployDate();
    }
});

Template.modalRemovalConfirmation.events({
    'click #deleteDeploy': function (event) {
        event.preventDefault();
        var currentDeploy = DeployHelper.getCurrentDeploy();
        if(currentDeploy != null){
            $('#myModal').modal('hide');
            DeploymentList.remove({_id: currentDeploy._id}, function (err) {
                if (err) {
                    throw err;
                }
                DeployHelper.setCurrentDeploy(null);
            });
        }
    }
});