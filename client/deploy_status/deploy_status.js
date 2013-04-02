/**
 * User: mfaye
 * Date: 02/04/13
 * Time: 16:38
 */
Template.mepStatus.helpers({
    canDisplayStatus: function () {
        var currentDeploy = Session.get('currentDeploy');
        var isUpdate = Session.get('isUpdateDeployStatus');
        console.log(currentDeploy);
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

Template.displayCurrentStatus.helpers({
    getLabelStatusClass: function () {
        var currentDeploy = Session.get('currentDeploy');
        var out = '';
        if(currentDeploy){
            if (currentDeploy.status == 'in_progress') {
                out = 'label-warning';
            } else if (currentDeploy.status == 'done') {
                out = 'label-important';
            }
        }

        return out;
    },
    getStatusLabel: function () {
        var currentDeploy = Session.get('currentDeploy');
        var out = '';
        if(currentDeploy){
            if (currentDeploy.status == 'in_progress') {
                out = 'En cours';
            } else if (currentDeploy.status == 'done') {
                out = 'Terminé';
            } else if (currentDeploy.status == 'edit') {
                out = "En cours d'édition";
            }
        }

        return out;
    },
    date: function(){
        var date2 = Session.get('currentDeploy');
        var out = '';
        if(date2){
            out = date2.date;
        }
        return out;
    }
});

Template.editCurrentStatus.helpers({
    isStatusSelected: function (status) {
        var currentDeploy = Session.get('currentDeploy');
        var out = '';
        if (currentDeploy && currentDeploy.status == status) {
            out = 'selected="selected"';
        }

        return out;
    }
});

Template.editCurrentStatus.events({
    'click a.btn.btn-success.btn-mini': function (event) {
        event.preventDefault();
        console.log('TOTO');
        var $date = $('#currentDeployDate');
        var $status = $('#currentDeployStatus');
        console.log($status.attr('value'));
        if ($status.val() != '' && $date.val() != '') {
            var currentDeploy = Session.get('currentDeploy');
            currentDeploy.date = $date.val();
            currentDeploy.status = $status.val();
            DeploymentList.update({_id: currentDeploy._id}, {$set:{date:$date.val(), status:$status.val()}});
            Session.set('currentDeploy', currentDeploy);
        }
        Session.set('isUpdateDeployStatus', false);
    }
});