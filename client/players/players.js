/**
 * User: mfaye
 * Date: 29/03/13
 * Time: 16:18
 */
Template.playerList.rendered = function(){
    var $typeahead = $('.typeahead');
    if($typeahead.length > 0){
        $typeahead.typeahead({
            source: PlayersWidget.checkForAvailablePlayers,
            updater: PlayersWidget.updateCurrentPlayerList
        });
    }
};

Template.playerList.events({
    'click a#updatePlayersList': function(event){
        event.preventDefault();
        console.log(event, this);
        var isUpdate = Session.get(PlayersWidget.isUpdateSessionKey);
        if(!isUpdate || isUpdate == ''){
            Session.set(PlayersWidget.isUpdateSessionKey, true);
        }else{
            Session.set(PlayersWidget.isUpdateSessionKey, false);
        }
    },
    'click [id*=removePlayer_]':function(event){
        event.preventDefault();
        var self = this;
        var currentDeploy = Session.get('currentDeploy');
        if(currentDeploy && currentDeploy._id){
            DeploymentList.find({_id: currentDeploy._id}).forEach(function(deploy){
                var newPlayerList = _.reject(deploy.playerList, function(player){
                    return (player._id == self._id);
                });
                newPlayerList = _.toArray(newPlayerList);
                DeploymentList.update({_id: deploy._id}, {$set: {playerList: newPlayerList}}, function(err){
                    if(err){
                        throw err;
                    }
                    currentDeploy.playerList = newPlayerList;
                    Session.set('currentDeploy', currentDeploy);
                });

            });
        }
    }
});

function canUpdate() {
    return (Session.get(PlayersWidget.isUpdateSessionKey) && Handlebars._default_helpers.isEdit());
}
Template.playerList.helpers({
    isUpdate: function(){
        return canUpdate();
    },

    canDelete: function(){
        return canUpdate() && (this._id != Meteor.userId());
    },

    playerList : function(){
        var out = null;
        var currentDeploy = Session.get('currentDeploy');
        if(currentDeploy){
            out = currentDeploy.playerList;
        }

        return out;
    }
});

Meteor.methods({
    checkForAvailablePlayers: function(query){

    }
});