/**
 * User: mfaye
 * Date: 02/04/13
 * Time: 16:38
 */
Template.mepStatus.helpers({
    canDisplayStatus: function () {
        var currentDeploy = Session.get('currentDeploy');
        var isUpdate = Session.get('isUpdateDeployStatus');
        var out = false;
        if (currentDeploy) {
            out = (currentDeploy.date != null);
            out = (out && currentDeploy.status != '');
            if (typeof isUpdate != 'undefined') {
                out = (out && !isUpdate);
            }
        } else {
            out = true;
        }

        return out;
    },
    getLabelStatusClass: function () {
        var currentDeploy = Session.get('currentDeploy');
        var out = '';
        if (currentDeploy == 'in_progress') {
            out = 'label-warning';
        } else if (currentDeploy == 'done') {
            out = 'label-important';
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
    var currentDeploy = Session.get('currentDeploy');
    var out = '';
    if (currentDeploy) {
        if (currentDeploy.status == 'in_progress') {
            out = 'label-warning';
        } else if (currentDeploy.status == 'done') {
            out = 'label-important';
        }
    }

    return out;
}

function getStatusLabel() {
    var currentDeploy = Session.get('currentDeploy');
    var out = '';
    if (currentDeploy) {
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
    var date2 = Session.get('currentDeploy');
    var out = '';
    if (date2) {
        out = date2.date;
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
            var currentDeploy = Session.get('currentDeploy');
            currentDeploy.date = $date.val();
            DeploymentList.update({_id: currentDeploy._id}, {$set: {date: $date.val()}});
            Session.set('currentDeploy', currentDeploy);
        }
        Session.set('isUpdateDeployStatus', false);
    }
});

function switchStatus(newStatus) {
    var currentDeploy = Session.get('currentDeploy');
    if (currentDeploy && currentDeploy._id) {
        currentDeploy.status = newStatus;
        DeploymentList.update({_id: currentDeploy._id}, {$set: {status: currentDeploy.status}});
        Session.set('currentDeploy', currentDeploy);
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
        var currentDeploy = Session.get('currentDeploy');
        if (currentDeploy && currentDeploy._id) {
            $('#myModal').modal('hide');
            DeploymentList.remove({_id: currentDeploy._id}, function (err) {
                if (err) {
                    throw err;
                }
                Session.set('confirmationAskedForRemoval', null);
                Session.set('currentDeploy', null);
            });
        }
    }
});