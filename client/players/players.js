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
    }
});

Template.playerList.helpers({
    isUpdate: function(){
        return Session.get(PlayersWidget.isUpdateSessionKey);
    },

    playerList : function(){
        var currentDeploy = Session.get('currentDeploy');
        var out = null;
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