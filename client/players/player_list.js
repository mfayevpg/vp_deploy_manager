/**
 * User: mfaye
 * Date: 29/03/13
 * Time: 16:18
 */
Template.playerListDisplay.rendered = function(){
    var $typeahead = $('.typeahead');
    if($typeahead.length > 0){
        $typeahead.typeahead({
            source: PlayersWidget.checkForAvailablePlayers,
            updater: PlayersWidget.updateCurrentPlayerList
        });
    }
};

Template.playerListDisplay.events({
    'click a#updatePlayersList': function(event){
        event.preventDefault();
        DeployHelper.togglePlayerListUpdateState();
    },
    'click [id*=removePlayer_]':function(event){
        event.preventDefault();
        var self = this;
        var currentDeploy = DeployHelper.getCurrentDeploy();
        if(currentDeploy != null){
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
                    DeployHelper.setCurrentDeploy(currentDeploy);
                });

            });
        }
    }
});

function canUpdate() {
    return (DeployHelper.getPlayerListUpdateState() && Handlebars._default_helpers.canUpdate());
}
Template.playerListDisplay.helpers({
    isUpdate: function(){
        return canUpdate();
    },

    canDelete: function(){
        return canUpdate() && (this._id != Meteor.userId());
    },

    playerList : function(){
        var out = null;
        var currentDeploy = DeployHelper.getCurrentDeploy();
        if(currentDeploy != null){
            out = currentDeploy.playerList;
        }

        return out;
    }
});